const Router    = require('koa-router');

// load CPP analysis plugin
const Analysis = require('./build/Release/analysis');

const router = {
	unprotected: new Router(),
	protected: new Router(),
};

router.unprotected.get('/test', (ctx) => {
	ctx.body = {success: 'true', message: 'Hello World!'};
});

router.protected.get('/testAuth', (ctx) => {
	ctx.body = {success: 'true', message: 'Access Granted'};
});

router.protected.post('/analyze', async (ctx) => {
	console.log(`New Analyze Request: ${ctx.request.body.samples} samples`);

	const data = {
		startTime: ctx.request.body.startTime,
		samples: ctx.request.body.samples,
		values: new Float32Array(ctx.request.body.samples),
		deltas: new Uint16Array(ctx.request.body.samples),
	};

	for(let i = 0; i < data.samples; i++){
		[data.deltas[i], data.values[i]] = ctx.request.body.data[i];
	}

	const ret = await Analysis.analyze(data.samples, data.values, data.deltas);

	ctx.body = {success: 'true', message: `return: ${ret}`};
});

module.exports = router;
