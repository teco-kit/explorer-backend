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

	ctx.redirect(`https://img.shields.io/badge/version-${latestVersion}-blue.svg?style=flat&logo=data:image/svg+xml;base64,PHN2ZyBiYXNlUHJvZmlsZT0idGlueSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2aWV3Qm94PSIwIDAgMzUgMzUiPjxwYXRoIGZpbGw9IiNGRkYiIGQ9Ik0yMS41IDMzLjFjMCAxIC44IDEuOCAxLjggMS44czEuOC0uOCAxLjgtMS44di0yLjloLTMuNnYyLjl6bTAtMzEuM3YyLjloMy42VjEuOGMwLTEtLjgtMS44LTEuOC0xLjhzLTEuOC44LTEuOCAxLjh6bS01LjggMHYyLjloMy42VjEuOGMwLTEtLjgtMS44LTEuOC0xLjhzLTEuOC44LTEuOCAxLjh6bTAgMzEuM2MwIDEgLjggMS44IDEuOCAxLjhzMS44LS44IDEuOC0xLjh2LTIuOWgtMy42djIuOXpNOS45IDEuOHYyLjloMy42VjEuOGMwLTEtLjgtMS44LTEuOC0xLjhTOS45LjggOS45IDEuOHptMCAzMS4zYzAgMSAuOCAxLjggMS44IDEuOHMxLjgtLjggMS44LTEuOHYtMi45SDkuOXYyLjl6TTAgMjMuMmMwIDEgLjggMS44IDEuOCAxLjhoMi45di0zLjVIMS44Yy0xIDAtMS44LjctMS44IDEuN3ptMzMuMi0xLjdoLTIuOVYyNWgyLjljMSAwIDEuOC0uOCAxLjgtMS44IDAtLjktLjgtMS43LTEuOC0xLjd6TTAgMTcuNWMwIDEgLjggMS44IDEuOCAxLjhoMi45di0zLjVIMS44Yy0xLS4xLTEuOC42LTEuOCAxLjd6bTMzLjItMS44aC0yLjl2My41aDIuOWMxIDAgMS44LS44IDEuOC0xLjhzLS44LTEuNy0xLjgtMS43ek0wIDExLjdjMCAxIC44IDEuOCAxLjggMS44aDIuOVY5LjlIMS44Yy0xIDAtMS44LjgtMS44IDEuOHptMzMuMi0xLjhoLTIuOXYzLjVoMi45YzEgMCAxLjgtLjggMS44LTEuOHMtLjgtMS43LTEuOC0xLjd6TTYuNCAyNi43YzAgMSAuOCAxLjkgMS45IDEuOWgxOC41YzEgMCAxLjktLjggMS45LTEuOVY4LjJjMC0xLS44LTEuOS0xLjktMS45SDguMmMtMSAwLTEuOS44LTEuOSAxLjl2MTguNmguMXoiLz48L3N2Zz4=`);
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
