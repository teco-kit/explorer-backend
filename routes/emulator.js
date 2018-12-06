const Router        = require('koa-router');
const Config        = require('config');

const config        = Config.get('server');

const model = {
	Analysis: require('../models/analysis').model,
};

const deviceId = config.emulator.deviceid.split('x')[1].toLowerCase();

const emulatorRouter = new Router();


// assert authKey (?auth=<key>)
emulatorRouter.use(async (ctx, next) => {
	if(ctx.query.auth === config.emulator.authKey){
		await next();
	}else{
		ctx.status = 401;
	}
});

emulatorRouter.get('/dataset_id', async (ctx) => {
	const datasets = await model.Analysis.find({
		id: {$regex: `^${deviceId}`}
	});

	const count = datasets.length;

	const offset = Buffer.alloc(2);

	offset.writeUInt16BE(count, 0);

	ctx.body = {
		datasets: count,
		deviceid: `0x${deviceId}`,
		datasetid: `0x${deviceId}${offset.toString('hex')}`,
	};
});

module.exports = emulatorRouter;
