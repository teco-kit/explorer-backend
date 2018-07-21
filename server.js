const Koa         = require('koa');
const Router      = require('koa-router');
const Logger      = require('koa-logger');
const Bodyparser  = require('koa-bodyparser');
const JWT         = require('koa-jwt');
const JwksRsa     = require('jwks-rsa');
const Config      = require('config');

// parse config
const config      = Config.get('server');

// import routes
const router      = require('./router.js');

// instantiate koa
const koa         = new Koa();

// setup koa middlewares
koa.use(Logger());
koa.use(Bodyparser());

// handle koa-jwt errors
koa.use(function(ctx, next){
	return next().catch((err) => {
		if (401 == err.status) {
			ctx.status = 401;
			ctx.body = {success: false, message: "authentification failed"};
		} else {
			throw err;
		}
	});
});

// unprotected routes
koa.use(router.unprotected.routes());

// protected routes
koa.use(JWT({
	secret: JwksRsa.koaJwtSecret({
		cache: true,
		rateLimit: true,
		jwksRequestsPerMinute: config.auth.jwksReqPerMin,
		jwksUri: config.auth.jwksUri,
	}),
	audience: config.auth.audience,
	issuer: config.auth.issuer,
	algorithms: ['RS256'],
}));

koa.use(router.protected.routes());
koa.listen(3000);
