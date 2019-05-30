const Koa          = require('koa');
const Logger       = require('koa-logger');
const KoaJWT       = require('koa-jwt');
const KoaCors      = require('@koa/cors');
const KoaStatic    = require('koa-static');
const JwksRsa      = require('jwks-rsa');
const Config       = require('config');
const Mongoose     = require('mongoose');

// parse config
const config = Config.get('server');

// import routes
const router = require('./routes/router.js');

// connect to Mongo
Mongoose.connect(config.mongo.url, {useNewUrlParser: true})
	.then(
		() => { console.log('MongoDB connected!'); },
		(e) => { console.error(e, 'MongoDB connection error:'); }
	);

// models
const model = {
	user: require('./models/user').model,
};

// instantiate koa
const server = new Koa();

// setup koa middlewares
server.use(Logger());
server.use(KoaCors());
server.use(KoaStatic('./public', {maxage: 1}));

// catch errors
server.use(async (ctx, next) => {
	try {
		await next();
	} catch(err) {
		console.log(err.status);
		ctx.status = err.status || 500;
		ctx.body = err.message;
	}
});

// unprotected routes
server.use(router.unprotected.routes());

// handle koa-jwt errors
server.use((ctx, next) => next().catch(err => new Promise((resolve, reject) => {
	// discard post data
	ctx.req.on('data', () => {
		// discard data
	});
	ctx.req.on('end', () => {
		if(err.status === 401){
			ctx.status = 401;
			ctx.body = {
				success: false,
				id: 'authentification failed',
			};
			resolve();
		} else {
			reject();
			throw err;
		}
	});
})));

// protected routes
server.use(KoaJWT({
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
server.use(async (ctx, next) => {
	/* [ctx.state.user.doc] = await model.User.find({
		sub: ctx.state.user.sub,
	}); */

	if(!ctx.state.user.doc){
		console.log(`welcome: ${ctx.state.user.nickname}!`);
		/* ctx.state.user.doc = await model.User.create({
			sub: ctx.state.user.sub,
			nickname: ctx.state.user.nickname,
			role: 'user',
		}); */
	}
	await next();
});

server.use(router.protected.routes());

module.exports = server.listen(3000);
