const Router       = require('koa-router');
const KoaBody      = require('koa-body');

const controller = require('../../controller/experiment');

const router = new Router();

/**
 * get all experiments
 * route:					/experiments
 * method type: 	GET
 */
router.get('/', async (ctx) => {
	await controller.getExperiments(ctx);
});

/**
 * get experiment by id
 * route:					/experiments/:id
 * method type: 	GET
 */
router.get('/:id', async (ctx) => {
	await controller.getExperimentById(ctx);
});

/**
 * create a new experiment
 * route:					/experiments
 * method type: 	POST
 */
router.post('/', KoaBody(), async (ctx) => {
	await controller.createExperiment(ctx);
});

/**
 * update a specific experiments
 * route:					/experiments/:id
 * method type: 	PUT
 */
router.put('/:id', KoaBody(), async (ctx) => {
	await controller.updateExperimentById(ctx);
});

/**
 * delete all experiments
 * route:					/experiments
 * method type: 	DELETE
 */
router.del('/', async (ctx) => {
	await controller.deleteExperiments(ctx);
});

/**
 * delete a specific experiment
 * route:					/experiments/:id
 * method type: 	DELETE
 */
router.del('/:id', async (ctx) => {
	await controller.deleteExperimentById(ctx);
});


module.exports = router;
