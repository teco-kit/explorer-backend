const Router      = require('koa-router');
const KoaBody      = require('koa-body');

// import controller
const labelController = require('../../../controller/datasetLabel');

// mounted at /labels
const labelRouter = new Router();

/**
 * get all labels for current user
 * route:					/datasets/{id}/labelings/{id}/labels/
 * method type: 	GET
 */
labelRouter.get('/', async (ctx) => {
	await labelController.getLabels(ctx);
});

/**
 * get label by id
 * route:					/datasets/{id}/labelings/{id}/labels/:id
 * method type: 	GET
 */
labelRouter.get('/:id', async (ctx) => {
	await labelController.getLabelById(ctx);
});

/**
 * create a new label
 * route:					/datasets/{id}/labelings/{id}/labels/
 * method type: 	POST
 */
labelRouter.post('/', KoaBody(), async (ctx) => {
	await labelController.createLabel(ctx);
});

/**
 * for handling requests that try to POST a new label
 * with id -> Method not allowed (405)
 * route:					/datasets/{id}/labelings/{id}/labels/:id
 * method type: 	POST
 */
labelRouter.post('/:id', async (ctx) => {
	ctx.status = 500;
	ctx.body = {error: 'Method Not Allowed'};
});

/**
 *  update a bulk of labels
 * route:					/datasets/{id}/labels
 * method type: 	PUT
 */
labelRouter.put('/', KoaBody(), async (ctx) => {
	await labelController.updateLabels(ctx);
});

/**
 * update a specific labels
 * route:					/datasets/{id}/labelings/{id}/labels/:id
 * method type: 	PUT
 */
labelRouter.put('/:id', KoaBody(), async (ctx) => {
	await labelController.updateLabelById(ctx);
});

/**
 * delete all labels
 * route:					/datasets/{id}/labelings/{id}/labels/
 * method type: 	DELETE
 */
labelRouter.del('/', async (ctx) => {
	await labelController.deleteLabels(ctx);
});

/**
 * delete a specific label
 * route:					/datasets/{id}/labelings/{id}/labels/:id
 * method type: 	DELETE
 */
labelRouter.del('/:id', async (ctx) => {
	await labelController.deleteLabelById(ctx);
});


module.exports = labelRouter;
