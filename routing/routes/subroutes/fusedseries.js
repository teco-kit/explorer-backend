const Router      = require('koa-router');
const KoaBody      = require('koa-body');

// import controller
const fusedseriesController = require('../../../controller/fusedseries');

// mounted at /fusedseries
const fusedseriesRouter = new Router();

/**
 * get all fusedseries for current user
 * route:					/datasets/{id}/fusedseries
 * method type: 	GET
 */
fusedseriesRouter.get('/', async (ctx) => {
	await fusedseriesController.getFusedseries(ctx);
});

/**
 * get fusedserie by id
 * route:					/datasets/{id}/fusedseries/:id
 * method type: 	GET
 */
fusedseriesRouter.get('/:id', async (ctx) => {
	await fusedseriesController.getFusedserieById(ctx);
});

/**
 * create a new fusedserie
 * route:					/datasets/{id}/fusedseries
 * method type: 	POST
 */
fusedseriesRouter.post('/', KoaBody(), async (ctx) => {
	await fusedseriesController.createFusedserie(ctx);
});

/**
 * for handling requests that try to POST a new fusedserie
 * with id -> Method not allowed (405)
 * route:					/datasets/{id}/fusedseries/:id
 * method type: 	POST
 */
fusedseriesRouter.post('/:id', async (ctx) => {
	ctx.status = 500;
	ctx.body = {error: 'Method Not Allowed'};
});

/**
 *  update a bulk of fusedseries
 * route:					/datasets/{id}/fusedseries
 * method type: 	PUT
 */
fusedseriesRouter.put('/', KoaBody(), async (ctx) => {
	await fusedseriesController.updateFusedseries(ctx);
});

/**
 * update a specific fusedseries
 * route:					/datasets/{id}/fusedseries/:id
 * method type: 	PUT
 */
fusedseriesRouter.put('/:id', KoaBody(), async (ctx) => {
	await fusedseriesController.updateFusedserieById(ctx);
});

/**
 * delete all fusedseries
 * route:					/datasets/{id}/fusedseries
 * method type: 	DELETE
 */
fusedseriesRouter.del('/', async (ctx) => {
	await fusedseriesController.deleteFusedseries(ctx);
});

/**
 * delete a specific fusedserie
 * route:					/datasets/{id}/Fusedseries/:id
 * method type: 	DELETE
 */
fusedseriesRouter.del('/:id', async (ctx) => {
	await fusedseriesController.deleteFusedserieById(ctx);
});


module.exports = fusedseriesRouter;
