const Router       = require('koa-router');
const KoaBody      = require('koa-body');

// import controller
const labelingController = require('../../controller/labeling');

// mounted at /labelings
const labelingRouter = new Router();

/**
 * get all labelings for current user
 * route:					/labelings
 * method type: 	GET
 */
labelingRouter.get('/', async (ctx) => {
	await labelingController.getLabelings(ctx);
});

/**
 * get labeling by id
 * route:					/labelings/:id
 * method type: 	GET
 */
labelingRouter.get('/:id', async (ctx) => {
	await labelingController.getLabelingById(ctx);
});

/**
 * create a new labeling
 * route:					/labelings
 * method type: 	POST
 */
labelingRouter.post('/', KoaBody(), async (ctx) => {
	await labelingController.createLabeling(ctx);
});

/**
 * for handling requests that try to POST a new labeling
 * with id -> Method not allowed (405)
 * route:					/labelings/:id
 * method type: 	POST
 */
labelingRouter.post('/:id', async (ctx) => {
	ctx.status = 500;
	ctx.body = {error: 'Method Not Allowed'};
});

/**
 *  update a bulk of labelings
 * route:					/labelings
 * method type: 	PUT
 */
labelingRouter.put('/', KoaBody(), async (ctx) => {
	await labelingController.updateLabelings(ctx);
});

/**
 * update a specific labelings
 * route:					/labelings/:id
 * method type: 	PUT
 */
labelingRouter.put('/:id', KoaBody(), async (ctx) => {
	await labelingController.updateLabelingById(ctx);
});

/**
 * delete all labelings
 * route:					/labelings
 * method type: 	DELETE
 */
labelingRouter.del('/', async (ctx) => {
	await labelingController.deleteLabelings(ctx);
});

/**
 * delete a specific labeling
 * route:					/labelings/:id
 * method type: 	DELETE
 */
labelingRouter.del('/:id', async (ctx) => {
	await labelingController.deleteLabelingById(ctx);
});


module.exports = labelingRouter;
