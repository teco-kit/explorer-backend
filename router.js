const Router = require('koa-router');

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
	const input = [
		ctx.request.body.val1,
		ctx.request.body.val2,
	];

	const ret = await Analysis.analyze(parseInt(input[0]), parseInt(input[1]));

	ctx.body = {success: 'true', message: `Output: ${ret}`};
});

module.exports = router;