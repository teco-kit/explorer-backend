const Router       = require('koa-router');
const KoaBody      = require('koa-body');

const controller = require('../../controller/labelDefinition');

const router = new Router();

/**
 * get all labelDefinition for current user
 * route:					/labelDefinition
 * method type: 	GET
 */
router.get('/', async (ctx) => {
	await controller.getLabelDefinitions(ctx);
});

/**
 * get labeling by id
 * route:					/labelDefinition/:id
 * method type: 	GET
 */
router.get('/:id', async (ctx) => {
	await controller.getLabelDefinitionById(ctx);
});

/**
 * create a new labeling
 * route:					/labelDefinition
 * method type: 	POST
 */
router.post('/', KoaBody(), async (ctx) => {
	await controller.createLabelDefinition(ctx);
});

/**
 * update a specific labelDefinition
 * route:					/labelDefinition/:id
 * method type: 	PUT
 */
router.put('/:id', KoaBody(), async (ctx) => {
	await controller.updateLabelDefinitionById(ctx);
});

/**
 * delete all labelDefinition
 * route:					/labelDefinition
 * method type: 	DELETE
 */
router.del('/', async (ctx) => {
	await controller.deleteLabelDefinitions(ctx);
});

/**
 * delete a specific labeling
 * route:					/labelDefinition/:id
 * method type: 	DELETE
 */
router.del('/:id', async (ctx) => {
	await controller.deleteLabelDefinitionById(ctx);
});


module.exports = router;
