const Router      = require('koa-router');
const Amqp        = require('amqplib/callback_api');
const Config      = require('config');
const KoaProtoBuf = require('koa-protobuf');

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
	ctx.body = proto.DatasetResponse.encode({
		success: true,
		status: 'QUEUED',
		id: msg.analysis_id,
	}).finish();
});

module.exports = datasetRouter;
