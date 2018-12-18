const Router        = require('koa-router');
const Amqp          = require('amqplib/callback_api');
const Config        = require('config');
const KoaProtoBuf   = require('koa-protobuf');
const KoaBodyParser = require('koa-bodyparser');
const KoaMulter     = require('koa-multer');
const Mongoose      = require('mongoose');
const JsonValidate  = require('jsonschema').validate;

const multer = KoaMulter({
	storage: KoaMulter.memoryStorage(),
});

const model = {
	Dataset: require('../models/dataset').model,
	Analysis: require('../models/analysis').model,
	Annotation: require('../models/annotation').model,
};

const proto = require('../protocol');

// parse config
const config       = Config.get('server');

let msgChannel;
const q = 'classify_queue';

Amqp.connect(config.ampq.url, (err, conn) => {
	conn.createChannel((err2, ch) => {
		msgChannel = ch;
		ch.assertQueue(q, {durable: true});
	});
});

// mounted at /dataset
const datasetRouter = new Router();

// submit new dataset
datasetRouter.post('/', KoaProtoBuf.protobufParser(proto.DatasetRequest), async (ctx) => {
	const newDataset = {
		startTime: new Date(+ctx.request.proto.dataset.startTime),
		sensorData: [],
	};

	for(let i = 0; i < ctx.request.proto.dataset.sensorData.length; i++){
		newDataset.sensorData.push({
			sensorType: (ctx.request.proto.dataset.sensorData[i].SensorType === 0) ? 'VOC' : 'IMU',
			sensorId: ctx.request.proto.dataset.sensorData[i].SensorId,
			numSamples: ctx.request.proto.dataset.sensorData[i].numSamples,
			data: proto.SensorDataset_t.encode({
				samples: ctx.request.proto.dataset.sensorData[i].samples,
			}).finish(),
		});
	}

	const dataset = await model.Dataset.create(newDataset);
	const analysis = await model.Analysis.create({
		user: ctx.state.user.doc._id,
		dataset: dataset._id,
	});
	console.log(`New Dataset: ${dataset._id.toString()} \nNew Analysis: ${analysis._id.toString()}`);
	const msg = {
		action: 'analyze',
		analysis_id: analysis._id.toHexString(),
	};
	msgChannel.sendToQueue(q, Buffer.from(JSON.stringify(msg)), {persistent: true});

	ctx.set('Content-Type', 'application/x-protobuf');

	const buffer = proto.DatasetResponse.encode({
		success: true,
		status: 'QUEUED',
		id: msg.analysis_id,
	}).finish();
	ctx.body = buffer;
});

// submit chunks
datasetRouter.post('/:id', multer.fields([
	{ name: 'meta', maxCount: 1 },
	{ name: 'data', maxCount: 1 }
]), async (ctx) => {
	const meta = JSON.parse(ctx.req.files.meta[0].buffer.toString());
	const data = ctx.req.files.data[0].buffer;

	// decode
	let { startTime } = meta;
	const { interval, numChunks, MTU } = meta;

	startTime = new Date(startTime);

	const samplesPerChunk = (MTU / 4) - 1;

	const samples = [];

	const ids = [];

	for(let i = 0; i < numChunks; i++){
		const start = MTU * i;
		const end = MTU * (i + 1);
		const chunkBuffer = data.slice(start, end);
		const chunk = new Uint32Array(
			chunkBuffer.buffer,
			chunkBuffer.byteOffset,
			chunkBuffer.byteLength / Uint32Array.BYTES_PER_ELEMENT
		);

		ids.push(chunk[0]);

		for(let j = 0; j < samplesPerChunk; j++){
			const sample = chunk[j + 1];
			if(sample !== undefined){
				samples.push(sample);
			}else{
				// console.log('undef');
			}
		}
	}
	// TODO: 1 sample is missing. Investigate

	// TODO: check for missing chunks

	// encode
	const newDataset = {
		startTime: startTime,
		sensorData: [],
	};

	const samplesSet = [];

	for(const sample of samples){
		samplesSet.push({
			voc: {
				value: sample,
				voc: sample,
			},
			delta: interval,
		});
	}

	console.log(samplesSet[0], samplesSet[1], samplesSet[2]);

	newDataset.sensorData.push({
		sensorType: 'VOC',
		sensorId: 0,
		numSamples: samples.length,
		data: proto.SensorDataset_t.encode({
			samples: samplesSet,
		}).finish(),
	});

	const [, datasetID] = ctx.params.id.split('x');

	const dataset = await model.Dataset.create(newDataset);
	const analysis = await model.Analysis.create({
		user: ctx.state.user.doc._id,
		dataset: dataset._id,
		id: datasetID,
	});

	console.log(`New Dataset: ${dataset._id.toString()} \nNew Analysis: mongo#${analysis._id.toString()} id#0x${datasetID}`);

	ctx.body = {
		success: true,
		msg: 'okay',
	};
});

// get annotation
datasetRouter.get('/:id/result', async (ctx) => {
	// TODO: user can only view their own results
	const analysis = await model.Analysis.findOne({id: ctx.params.id.split('x')[1]}).populate('annotations').populate('dataset');

	if(analysis.annotations.length === 0){
		ctx.status = 202;
		ctx.body = {success: false, message: 'no annotations found'};
		return;
	}

	const annotation = analysis.annotations[analysis.annotations.length - 1];

	const start = analysis.dataset.startTime;

	const bands = [];

	for(const band of annotation.bands) {
		// calculate delta in hours
		const delta = (band.from - start) / 3.6e6;
		const bin = parseInt(delta, 10);
		bands[bin] = bands[bin] || [];
		bands[bin].push(band);
	}

	const res = {
		startTime: analysis.dataset.startTime,
		result: {
			apnea: Array(bands.length),
			hypopnea: Array(bands.length),
			noise: Array(bands.length),
			sleepScore: 50, // TODO: implement
			sleepTime: 1231342324, // TODO: implememnt as milliseconds
			averageAHI: 20, // TODO: implement
		}
	};

	for(const [i, bin] of bands.entries()){
		for(const type of Object.keys(res.result)){
			res.result[type][i] = bin.filter(elem => elem.state === type).length;
		}
	}

	ctx.body = res;
});

// assert admin
datasetRouter.use(async (ctx, next) => {
	if(ctx.state.user.doc.role !== 'admin'){
		console.log(`User ${ctx.state.user.nickname} is not an Admin!`);
		ctx.status = 401;
	}else{
		await next();
	}
});

// get dataset
datasetRouter.get('/:id', async (ctx) => {
	const {dataset} = await model.Analysis.findOne({ id: ctx.params.id.split('x')[1]}).populate('dataset');

	ctx.set('Content-Type', 'application/x-protobuf');

	ctx.body = proto.DatasetGetResponse.encode({
		id: ctx.params.id,
		startTime: dataset.startTime.getTime(),
		numSamples: dataset.sensorData[0].numSamples,
		data: dataset.sensorData[0].data,
	}).finish();
});

// delete dataset
datasetRouter.delete('/:id', async (ctx) => {
	const analysis = await model.Analysis.findOne({id: ctx.params.id.split('x')[1]});
	await model.Dataset.findById(analysis.dataset).remove();
	await analysis.remove();

	ctx.status = 200;
});

// list datasets
datasetRouter.get('/', async (ctx) => {
	const analyses = await model.Analysis.find({}).populate('dataset').populate('user');

	const output = [];
	analyses.forEach((analysis) => {
		output.push({
			id: `0x${analysis.id}`,
			user: analysis.user.nickname,
			numSamples: analysis.dataset.sensorData[0].numSamples,
			startTime: analysis.dataset.startTime,
		});
	});
	ctx.body = output;
});

// annotate dataset
datasetRouter.post('/:id/annotate', KoaBodyParser(), async (ctx) => {
	const res = JsonValidate(ctx.request.body, {
		type: 'array',
		items: {
			type: 'object',
			properties: {
				from: {type: 'date-time'},
				to: {type: 'date-time'},
				state: {
					type: 'string',
					enum: ['apnea', 'hypopnea', 'noise'],
				}
			}
		},
	});

	if(!res.valid){
		ctx.status = 415;
		ctx.body = {success: false, message: 'Invalid Schema'};
	}

	const annotation = await model.Annotation.create({
		type: 'manual',
		bands: ctx.request.body,
	});

	await model.Analysis.findOneAndUpdate({id: ctx.params.id.split('x')[1]}, {
		$push: {
			annotations: annotation._id
		}
	});

	ctx.body = {success: true, message: 'annotation saved'};
});

module.exports = datasetRouter;
