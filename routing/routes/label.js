const Router      = require('koa-router');
const KoaBody      = require('koa-body');

const controller = require('../../controller/label');

const router = new Router();

/**
 * get all labels for current user
 * route:					/labels
 * method type: 	GET
 */
router.get('/', async (ctx) => {
	await controller.getLabels(ctx);
});

/**
 * get label by id
 * route:					/labels/:id
 * method type: 	GET
 */
router.get('/:id', async (ctx) => {
	await controller.getLabelById(ctx);
});

/**
 * create a new label
 * route:					/labels
 * method type: 	POST
 */
router.post('/', KoaBody(), async (ctx) => {
	await controller.createLabel(ctx);
});

/**
 * for handling requests that try to POST a new label
 * with id -> Method not allowed (405)
 * route:					/labels/:id
 * method type: 	POST
 */
router.post('/:id', async (ctx) => {
	ctx.status = 500;
	ctx.body = {error: 'Method Not Allowed'};
});

/**
 *  update a bulk of labels
 * route:					/labels
 * method type: 	PUT
 */
router.put('/', KoaBody(), async (ctx) => {
	await controller.updateLabels(ctx);
});

/**
 * update a specific labels
 * route:					/labels/:id
 * method type: 	PUT
 */
router.put('/:id', KoaBody(), async (ctx) => {
	await controller.updateLabelById(ctx);
});

/**
 * delete all labels
 * route:					/labels
 * method type: 	DELETE
 */
router.del('/', async (ctx) => {
	await controller.deleteLabels(ctx);
});

/**
 * delete a specific label
 * route:					/labels/:id
 * method type: 	DELETE
 */
router.del('/:id', async (ctx) => {
	await controller.deleteLabelById(ctx);
});


module.exports = router;
