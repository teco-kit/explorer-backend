const Koa          = require('koa');
const Logger       = require('koa-logger');
const Config       = require('config');
const Mongoose     = require('mongoose');
const swaggerUi    = require('swagger-ui-koa');
const swaggerJSDoc = require('swagger-jsdoc');
const convert 		 = require('koa-convert');
const mount 			 = require('koa-mount');
const options 		 = require('./docs/config');

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

// load swagger options
const swaggerSpec = swaggerJSDoc(options);

// setup koa middlewares
server.use(Logger());
server.use(swaggerUi.serve);
server.use(convert(mount('/docs', swaggerUi.setup(swaggerSpec, false, {docExpansion: 'none'}, '#header { display: none }')))); // mount endpoint for access

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
