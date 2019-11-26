const Koa          = require('koa');
const config       = require('config');
const mongoose     = require('mongoose');
const cors				 = require('koa-cors');
const swaggerUi    = require('swagger-ui-koa');
const swaggerJSDoc = require('swagger-jsdoc');
const convert 		 = require('koa-convert');
const mount 			 = require('koa-mount');
const options 		 = require('./docs/config');

const router = require('./routing/router.js');
const authenticate = require('./authentication/authenticate');

// create server
const server = new Koa();

// connect to Mongo
mongoose.connect(config.db, {useNewUrlParser: true});

// suppress deprecation warnings
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

// load swagger options
const swaggerSpec = swaggerJSDoc(options);

// setup koa middlewares
server.use(cors());

server.use(swaggerUi.serve);
server.use(convert(mount('/api/docs', swaggerUi.setup(swaggerSpec, false, {docExpansion: 'none'}, '#header { display: none }')))); // mount endpoint for access

// check authentication
server.use(async (ctx, next) => {
	await authenticate(ctx, next);
});

// catch errors
server.use(async (ctx, next) => {
	try {
		await next();
	} catch (error) {
		ctx.body = {error: error.message};
		ctx.status = error.status || 500;
	}
});

// routing
server.use(router.routes());

// catch all middleware, only land here
// if no other routing rules match
// make sure it is added after everything else
server.use((ctx) => {
	ctx.body = {error: 'Not Found'};
	ctx.status = 404;
});

module.exports = server.listen(3000);
