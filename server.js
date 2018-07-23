const Koa          = require('koa');
const Logger       = require('koa-logger');
const Bodyparser   = require('koa-bodyparser');
const JWT          = require('koa-jwt');
const KoaAjv       = require('koa-ajv');
const JwksRsa      = require('jwks-rsa');
const Config       = require('config');
const Mongoose     = require('mongoose');

const Schema       = require('./schema.js');

// parse config
const config       = Config.get('server');

// import routes
const router       = require('./router.js');

// connect to Mongo
Mongoose.connect(config.mongo.url, {useNewUrlParser: true});

// instantiate koa
const koa          = new Koa();

// setup koa middlewares
koa.use(Logger());
koa.use(Bodyparser());
koa.use(KoaAjv({routes: Schema, strict: false}));

// handle koa-jwt errors
koa.use((ctx, next) => next().catch((err) => {
	if(err.status === 401){
		ctx.status = 401;
		ctx.body = {success: false, message: 'authentification failed'};
	}else{
		throw err;
	}
}));

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
