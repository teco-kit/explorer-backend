const Koa          = require('koa');
const Logger       = require('koa-logger');
const Bodyparser   = require('koa-bodyparser');
const KoaJWT       = require('koa-jwt');
const KoaAjv       = require('koa-ajv');
const JwksRsa      = require('jwks-rsa');
const Config       = require('config');
const Mongoose     = require('mongoose');

// json validation
const Schema       = require('./schema.js');

// parse config
const config       = Config.get('server');

// import routes
const router       = require('./routes/router.js');

// connect to Mongo
Mongoose.connect(config.mongo.url, {useNewUrlParser: true});

// models
const model = {
	User: require('./models/user').model,
};

// instantiate koa
const koa          = new Koa();

// setup koa middlewares
koa.use(Logger());
koa.use(Bodyparser());
koa.use(KoaAjv({routes: Schema, strict: false}));

// unprotected routes
koa.use(router.unprotected.routes());

// handle koa-jwt errors
koa.use((ctx, next) => next().catch((err) => {
	if(err.status === 401){
		ctx.status = 401;
		ctx.body = {success: false, message: 'authentification failed'};
	}else{
		throw err;
	}
}));

// protected routes
koa.use(KoaJWT({
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

// link mongoose document
koa.use(async (ctx, next) => {
	[ctx.state.user.doc] = await model.User.find({
		sub: ctx.state.user.sub,
	});

	if(!ctx.state.user.doc){
		console.log(`welcome: ${ctx.state.user.nickname}!`);
		ctx.state.user.doc = await model.User.create({
			sub: ctx.state.user.sub,
			nickname: ctx.state.user.nickname,
		});
	}
	next();
});

koa.use(router.protected.routes());
koa.listen(3000);
