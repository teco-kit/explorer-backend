const Router      = require('koa-router');
const KoaBody      = require('koa-body');

const controller = require('../../../controller/result');

const router = new Router();

/**
 * get all results for current user
 * route:					/datasets/{id}/results
 * method type: 	GET
 */
router.get('/', async (ctx) => {
	await controller.getResults(ctx);
});

/**
 * get result by id
 * route:					/datasets/{id}/results/:id
 * method type: 	GET
 */
router.get('/:id', async (ctx) => {
	await controller.getResultById(ctx);
});

/**
 * create a new result
 * route:					/datasets/{id}/results
 * method type: 	POST
 */
router.post('/', KoaBody(), async (ctx) => {
	await controller.createResult(ctx);
});

/**
 * update a specific results
 * route:					/datasets/{id}/results/:id
 * method type: 	PUT
 */
router.put('/:id', KoaBody(), async (ctx) => {
	await controller.updateResultById(ctx);
});

/**
 * delete all results
 * route:					/datasets/{id}/results
 * method type: 	DELETE
 */
router.del('/', async (ctx) => {
	await controller.deleteResults(ctx);
});

/**
 * delete a specific result
 * route:					/datasets/{id}/results/:id
 * method type: 	DELETE
 */
router.del('/:id', async (ctx) => {
	await controller.deleteResultById(ctx);
});


module.exports = router;
