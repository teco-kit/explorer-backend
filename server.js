const Koa          = require('koa');
const Logger       = require('koa-logger');
const Config       = require('config');
const mongoose     = require('mongoose');
const cors				 = require('koa-cors');
const swaggerUi    = require('swagger-ui-koa');
const swaggerJSDoc = require('swagger-jsdoc');
const convert 		 = require('koa-convert');
const mount 			 = require('koa-mount');
const options 		 = require('./docs/config');

// parse config
const config = Config.get('server');

// import routing
const router = require('./routing/router.js');

// instantiate koa
const server = new Koa();

// connect to Mongo
mongoose.connect(config.mongo.url, {useNewUrlParser: true})
	.then(
		() => { },
		(e) => {
			console.error(e, 'MongoDB connection error:');
			server.close();
		}
	);

// suppress deprecation warnings
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

// load swagger options
const swaggerSpec = swaggerJSDoc(options);

// setup koa middlewares
server.use(cors());
// only display logs in development
if(config.logger) {
	server.use(Logger());
}

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

// catch all middleware, only land here
// if no other routing rules match
// make sure it is added after everything else
server.use(async (ctx) => {
	ctx.body = {error: 'Not Found'};
	ctx.status = 404;
	return ctx;
});

module.exports = server.listen(3000);
