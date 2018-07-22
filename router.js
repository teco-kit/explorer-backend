const Router    = require('koa-router');

// load CPP analysis plugin
const Analysis = require('./build/Release/analysis');

const router = {
	unprotected: new Router(),
	protected:   new Router(),
};

router.unprotected.get('/test', (ctx, next) => {
	ctx.body = {success: 'true', message: 'Hello World!'};
});

router.protected.get('/testAuth', (ctx, next) => {
	ctx.body = {success: 'true', message: 'Access Granted'};
});

router.protected.post('/analyze', async (ctx, next) => {

	console.log(`New Analyze Request: ${ctx.request.body.samples} samples`);

	const ret = await Analysis.analyze(0, 0);

	ctx.body = {success: 'true', message: `Output: ${ret}`};
});

module.exports = router;