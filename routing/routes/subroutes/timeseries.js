const Router      = require('koa-router');
const KoaBody      = require('koa-body');

const controller = require('../../../controller/timeseries');

const router = new Router();

/**
 * get all timeseries for current user
 * route:					/datasets/{id}/timeseries
 * method type: 	GET
 */
router.get('/', async (ctx) => {
	await controller.getTimeseries(ctx);
});

/**
 * get timeserie by id
 * route:					/datasets/{id}/timeseries/:id
 * method type: 	GET
 */
router.get('/:id', async (ctx) => {
	await controller.getTimeserieById(ctx);
});

/**
 * create a new timeserie
 * route:					/datasets/{id}/timeseries
 * method type: 	POST
 */
router.post('/', KoaBody(), async (ctx) => {
	await controller.createTimeserie(ctx);
});

/**
 * update a specific timeseries
 * route:					/datasets/{id}/timeseries/:id
 * method type: 	PUT
 */
router.put('/:id', KoaBody(), async (ctx) => {
	await controller.updateTimeserieById(ctx);
});

/**
 * delete all timeseries
 * route:					/datasets/{id}/timeseries
 * method type: 	DELETE
 */
router.del('/', async (ctx) => {
	await controller.deleteTimeseries(ctx);
});

/**
 * delete a specific timeserie
 * route:					/datasets/{id}/Timeseries/:id
 * method type: 	DELETE
 */
router.del('/:id', async (ctx) => {
	await controller.deleteTimeserieById(ctx);
});


module.exports = router;
