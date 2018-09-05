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

	ctx.redirect(`https://img.shields.io/badge/version-${latestVersion}-4DA851.svg?style=popout&logoWidth=15&logo=data:image/svg+xml;base64,PHN2ZyBiYXNlUHJvZmlsZT0idGlueSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2aWV3Qm94PSIwIDAgMzUgNjAiPjxnIGZpbGw9IiNGRkYiPjxwYXRoIGQ9Ik0yMS41IDQ3LjJjMCAxIC44IDEuNyAxLjggMS43czEuOC0uOCAxLjgtMS43di0yLjhoLTMuNnYyLjh6TTIxLjUgMTYuOHYyLjhoMy42di0yLjhjMC0xLS44LTEuNy0xLjgtMS43cy0xLjguOC0xLjggMS43ek0xNS43IDE2Ljh2Mi44aDMuNnYtMi44YzAtMS0uOC0xLjctMS44LTEuN3MtMS44LjgtMS44IDEuN3pNMTUuNyA0Ny4yYzAgMSAuOCAxLjcgMS44IDEuN3MxLjgtLjggMS44LTEuN3YtMi44aC0zLjZ2Mi44ek05LjkgMTYuOHYyLjhoMy42di0yLjhjMC0xLS44LTEuNy0xLjgtMS43cy0xLjguOC0xLjggMS43ek05LjkgNDcuMmMwIDEgLjggMS43IDEuOCAxLjdzMS44LS44IDEuOC0xLjd2LTIuOEg5Ljl2Mi44ek0wIDM3LjZjMCAxIC44IDEuNyAxLjggMS43aDIuOXYtMy40SDEuOGMtMSAwLTEuOC43LTEuOCAxLjd6TTMzLjIgMzUuOWgtMi45djMuNGgyLjljMSAwIDEuOC0uOCAxLjgtMS43cy0uOC0xLjctMS44LTEuN3pNMCAzMmMwIDEgLjggMS43IDEuOCAxLjdoMi45di0zLjRIMS44Qy44IDMwLjMgMCAzMSAwIDMyek0zMy4yIDMwLjNoLTIuOXYzLjRoMi45YzEgMCAxLjgtLjggMS44LTEuNyAwLTEtLjgtMS43LTEuOC0xLjd6TTAgMjYuNGMwIDEgLjggMS43IDEuOCAxLjdoMi45di0zLjRIMS44Yy0xIDAtMS44LjgtMS44IDEuN3pNMzMuMiAyNC43aC0yLjl2My40aDIuOWMxIDAgMS44LS44IDEuOC0xLjdzLS44LTEuNy0xLjgtMS43ek02LjQgNDFjMCAxIC44IDEuOCAxLjkgMS44aDE4LjVjMSAwIDEuOS0uOCAxLjktMS44VjIzYzAtMS0uOC0xLjgtMS45LTEuOEg4LjJjLTEgMC0xLjkuOC0xLjkgMS44djE4eiIvPjwvZz48L3N2Zz4=`);
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
