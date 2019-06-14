const Router      = require('koa-router');
const KoaBody      = require('koa-body');

// import controller
const resultController = require('../../../controller/result');

// mounted at /results
const resultRouter = new Router();

/**
 * get all results for current user
 * route:					/datasets/{id}/results
 * method type: 	GET
 */
resultRouter.get('/', async (ctx) => {
	await resultController.getResults(ctx);
});

/**
 * get result by id
 * route:					/datasets/{id}/results/:id
 * method type: 	GET
 */
resultRouter.get('/:id', async (ctx) => {
	await resultController.getResultById(ctx);
});

/**
 * create a new result
 * route:					/datasets/{id}/results
 * method type: 	POST
 */
resultRouter.post('/', KoaBody(), async (ctx) => {
	await resultController.createResult(ctx);
});

/**
 * for handling requests that try to POST a new result
 * with id -> Method not allowed (405)
 * route:					/datasets/{id}/results/:id
 * method type: 	POST
 */
resultRouter.post('/:id', async (ctx) => {
	ctx.status = 500;
	ctx.body = {error: 'Method Not Allowed'};
});

/**
 *  update a bulk of results
 * route:					/datasets/{id}/results
 * method type: 	PUT
 */
resultRouter.put('/', KoaBody(), async (ctx) => {
	await resultController.updateResults(ctx);
});

/**
 * update a specific results
 * route:					/datasets/{id}/results/:id
 * method type: 	PUT
 */
resultRouter.put('/:id', KoaBody(), async (ctx) => {
	await resultController.updateResultById(ctx);
});

/**
 * delete all results
 * route:					/datasets/{id}/results
 * method type: 	DELETE
 */
resultRouter.del('/', async (ctx) => {
	await resultController.deleteResults(ctx);
});

/**
 * delete a specific result
 * route:					/datasets/{id}/results/:id
 * method type: 	DELETE
 */
resultRouter.del('/:id', async (ctx) => {
	await resultController.deleteResultById(ctx);
});


module.exports = resultRouter;
