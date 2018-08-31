const Router      = require('koa-router');
const Amqp        = require('amqplib/callback_api');
const Config      = require('config');
const KoaProtoBuf = require('koa-protobuf');
const Mongoose    = require('mongoose');

const model = {
	Dataset: require('../models/dataset').model,
	Analysis: require('../models/analysis').model,
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

datasetRouter.post('/submit', KoaProtoBuf.protobufParser(proto.DatasetRequest), async (ctx) => {
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
	console.log(buffer);
	ctx.body = buffer;
});

datasetRouter.post('/get', KoaProtoBuf.protobufParser(proto.DatasetGet), async (ctx) => {
	if(ctx.state.user.doc.role !== 'admin'){
		console.log(`User ${ctx.state.user.nickname} is not an Admin!`);
		ctx.status = 401;
		return;
	}

	const datasetID = Mongoose.Types.ObjectId.createFromHexString(ctx.request.proto.id);

	const { dataset } = await model.Analysis.findById(datasetID).populate('dataset');

	ctx.set('Content-Type', 'application/x-protobuf');

	ctx.body = proto.DatasetGetResponse.encode({
		id: datasetID.toHexString(),
		startTime: dataset.startTime.getTime(),
		numSamples: dataset.sensorData[0].numSamples,
		data: dataset.sensorData[0].data,
	}).finish();
	console.log(ctx.body);
});

module.exports = datasetRouter;
