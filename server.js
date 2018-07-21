const Koa        = require('koa');
const Router     = require('koa-router');
const logger     = require('koa-logger');
const Bodyparser = require('koa-bodyparser');
const JWT        = require('koa-jwt');

// import routes
const router     = require('./router.js');

// instantiate koa
const koa        = new Koa();

// setup koa middlewares
koa.use(logger());
koa.use(Bodyparser());

// handle koa-jwt errors
koa.use(function(ctx, next){
	return next().catch((err) => {
		if (401 == err.status) {
			ctx.status = 401;
			ctx.body = {success: false, message: "protected resource, use auth header + bearer"};
		} else {
			throw err;
		}
	});
});

// unprotected routes
koa.use(router.unprotected.routes());

// protected routes
koa.use(JWT({ secret: 'shared-secret' }));
koa.use(router.protected.routes());
koa.listen(3000);
