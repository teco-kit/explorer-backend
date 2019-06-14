const Router      = require('koa-router');
const KoaBody      = require('koa-body');

// import controller
const serviceController = require('../../controller/service');

// mounted at /services
const serviceRouter = new Router();

/**
 * get all services for current user
 * route:					/services
 * method type: 	GET
 */
serviceRouter.get('/', async (ctx) => {
	await serviceController.getServices(ctx);
});

/**
 * get service by id
 * route:					/services/:id
 * method type: 	GET
 */
serviceRouter.get('/:id', async (ctx) => {
	await serviceController.getServiceById(ctx);
});

/**
 * create a new service
 * route:					/services
 * method type: 	POST
 */
serviceRouter.post('/', KoaBody(), async (ctx) => {
	await serviceController.createService(ctx);
});

/**
 * for handling requests that try to POST a new service
 * with id -> Method not allowed (405)
 * route:					/services/:id
 * method type: 	POST
 */
serviceRouter.post('/:id', async (ctx) => {
	ctx.status = 500;
	ctx.body = {error: 'Method Not Allowed'};
});

/**
 *  update a bulk of services
 * route:					/services
 * method type: 	PUT
 */
serviceRouter.put('/', KoaBody(), async (ctx) => {
	await serviceController.updateServices(ctx);
});

/**
 * update a specific services
 * route:					/services/:id
 * method type: 	PUT
 */
serviceRouter.put('/:id', KoaBody(), async (ctx) => {
	await serviceController.updateServiceById(ctx);
});

/**
 * delete all services
 * route:					/services
 * method type: 	DELETE
 */
serviceRouter.del('/', async (ctx) => {
	await serviceController.deleteServices(ctx);
});

/**
 * delete a specific service
 * route:					/services/:id
 * method type: 	DELETE
 */
serviceRouter.del('/:id', async (ctx) => {
	await serviceController.deleteServiceById(ctx);
});


module.exports = serviceRouter;
