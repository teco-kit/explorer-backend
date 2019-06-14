const Koa          = require('koa');
const Logger       = require('koa-logger');
const KoaCors      = require('@koa/cors');
const KoaStatic    = require('koa-static');
const Config       = require('config');
const Mongoose     = require('mongoose');

// parse config
const config = Config.get('server');

// import routing
const router = require('./routing/router.js');

// connect to Mongo
Mongoose.connect(config.mongo.url, {useNewUrlParser: true})
	.then(
		() => { console.log('MongoDB connected!'); },
		(e) => { console.error(e, 'MongoDB connection error:'); }
	);

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
	} catch (error) {
		ctx.body = {error: error.message};
		ctx.status = error.status || 500;
		return ctx;
	}
});

// unprotected routing
server.use(router.unprotected.routes());
module.exports = server.listen(3000);
