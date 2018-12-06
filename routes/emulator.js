const Router        = require('koa-router');
const Config        = require('config');

const config        = Config.get('server');

const model = {
	Dataset: require('../models/dataset').model,
};

const deviceId = parseInt(config.emulator.deviceid, 16);

const datasetOffset = parseInt(`${config.emulator.deviceid}0000`, 16);

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
	const count = (await model.Dataset.find({
		id: {$gte: datasetOffset},
	})).length;

	ctx.body = {
		datasets: count,
		deviceid: `0x${deviceId.toString(16)}`,
		datasetid: `0x${(datasetOffset + count).toString(16)}`,
	};
});

module.exports = emulatorRouter;
