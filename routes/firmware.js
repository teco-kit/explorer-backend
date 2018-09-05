const Router      = require('koa-router');
const Config      = require('config');
const md5         = require('md5');

const model = {
	Firmware: require('../models/firmware').model,
};

// parse config
const config       = Config.get('server');

// mounted at /firmware
const firmwareRouter = new Router();

firmwareRouter.get('/badge.svg', async (ctx) => {
	const latestVersion = await model.Firmware.find({}, ['-binary'], {lean: true})
		.then(res => res.map(item => item.version))
		.then(res => Math.max(...res));

	ctx.redirect(`https://img.shields.io/badge/firmware-${latestVersion}-4DA851.svg?style=plastic`);
});

// assert authKey (?auth=<key>)
firmwareRouter.use(async (ctx, next) => {
	if(ctx.query.auth === config.firmware.authKey){
		await next();
	}else{
		ctx.status = 401;
	}
});

// submit new firmware
firmwareRouter.put('/:buildversion', async (ctx) => {
	// assert octet/stream
	if(!ctx.is('application/octet-stream')){
		ctx.status = 415;
		return;
	}

	// parse body
	const firmwareBinary = await new Promise((resolve) => {
		let ret;
		ctx.req.on('data', (data) => {
			ret += data;
		});

		ctx.req.on('end', () => resolve(Buffer.from(ret)));
	});

	// create firmware document
	const firmware = await model.Firmware.create({
		version: ctx.params.buildversion,
		binary: firmwareBinary,
		hash: md5(firmwareBinary),
	});

	// return data to client
	ctx.body = {
		success: true,
		id: firmware._id,
	};

	ctx.status = 200;
});


module.exports = firmwareRouter;
