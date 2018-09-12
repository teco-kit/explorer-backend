const Router        = require('koa-router');
const Amqp          = require('amqplib/callback_api');
const Config        = require('config');
const KoaProtoBuf   = require('koa-protobuf');
const KoaBodyParser = require('koa-bodyparser');
const Mongoose      = require('mongoose');
const JsonValidate  = require('jsonschema').validate;

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
	const datasetID = Mongoose.Types.ObjectId.createFromHexString(ctx.params.id);

	const { dataset } = await model.Analysis.findById(datasetID).populate('dataset');

	ctx.set('Content-Type', 'application/x-protobuf');

	ctx.body = proto.DatasetGetResponse.encode({
		id: datasetID.toHexString(),
		startTime: dataset.startTime.getTime(),
		numSamples: dataset.sensorData[0].numSamples,
		data: dataset.sensorData[0].data,
	}).finish();
});

// delete dataset
datasetRouter.delete('/:id', async (ctx) => {
	const analysisID = Mongoose.Types.ObjectId.createFromHexString(ctx.params.id);

	const analysis = await model.Analysis.findById(analysisID);
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
			id: analysis._id,
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

	const analysisID = Mongoose.Types.ObjectId.createFromHexString(ctx.params.id);

	const annotation = await model.Annotation.create({
		type: 'manual',
		bands: ctx.request.body,
	});

	await model.Analysis.findByIdAndUpdate(analysisID, {
		$push: {
			annotations: annotation._id
		}
	});

	ctx.body = {success: true, message: 'annotation saved'};
});

// get annotation
datasetRouter.get('/:id/result', async (ctx) => {
	const analysisID = Mongoose.Types.ObjectId.createFromHexString(ctx.params.id);
	const analysis = await model.Analysis.findById(analysisID).populate('annotations').populate('dataset');
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
		}
	};

	for(const [i, bin] of bands.entries()){
		for(const type of Object.keys(res.result)){
			res.result[type][i] = bin.filter(elem => elem.state === type).length;
		}
	}

	ctx.body = res;
});

module.exports = datasetRouter;
