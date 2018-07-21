const Router = require('koa-router');

const router = {
	unprotected: new Router(),
	protected:   new Router(),
};

router.unprotected.get('authorize', (ctx, next) => {
	ctx.body = 'unprotected';
});

router.protected.get('addData', (ctx, next) => {
	ctx.body = 'protected';
});

module.exports = router;