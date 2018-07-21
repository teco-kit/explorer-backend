const Router = require('koa-router');

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

module.exports = router;