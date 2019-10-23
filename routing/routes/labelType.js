const Router      = require('koa-router');
const KoaBody      = require('koa-body');

const controller = require('../../controller/labelType');

const router = new Router();

/**
 * get all labels for current user
 * route:					/labels
 * method type: 	GET
 */
router.get('/', async (ctx) => {
	await controller.getlabelTypes(ctx);
});

/**
 * get label by id
 * route:					/labels/:id
 * method type: 	GET
 */
router.get('/:id', async (ctx) => {
	await controller.getLabelTypeById(ctx);
});

/**
 * create a new label
 * route:					/labels
 * method type: 	POST
 */
router.post('/', KoaBody(), async (ctx) => {
	await controller.createLabelType(ctx);
});

/**
 * update a specific labels
 * route:					/labels/:id
 * method type: 	PUT
 */
router.put('/:id', KoaBody(), async (ctx) => {
	await controller.updateLabelTypeById(ctx);
});

/**
 * delete all labels
 * route:					/labels
 * method type: 	DELETE
 */
router.del('/', async (ctx) => {
	await controller.deletelabelTypes(ctx);
});

/**
 * delete a specific label
 * route:					/labels/:id
 * method type: 	DELETE
 */
router.del('/:id', async (ctx) => {
	await controller.deleteLabelTypeById(ctx);
});


module.exports = router;
