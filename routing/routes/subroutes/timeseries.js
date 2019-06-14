const Router      = require('koa-router');
const KoaBody      = require('koa-body');

// import controller
const timeseriesController = require('../../../controller/timeseries');

// mounted at /timeseries
const timeseriesRouter = new Router();

/**
 * get all timeseries for current user
 * route:					/datasets/{id}/timeseries
 * method type: 	GET
 */
timeseriesRouter.get('/', async (ctx) => {
	await timeseriesController.getTimeseries(ctx);
});

/**
 * get timeserie by id
 * route:					/datasets/{id}/timeseries/:id
 * method type: 	GET
 */
timeseriesRouter.get('/:id', async (ctx) => {
	await timeseriesController.getTimeserieById(ctx);
});

/**
 * create a new timeserie
 * route:					/datasets/{id}/timeseries
 * method type: 	POST
 */
timeseriesRouter.post('/', KoaBody(), async (ctx) => {
	await timeseriesController.createTimeserie(ctx);
});

/**
 * for handling requests that try to POST a new timeserie
 * with id -> Method not allowed (405)
 * route:					/datasets/{id}/timeseries/:id
 * method type: 	POST
 */
timeseriesRouter.post('/:id', async (ctx) => {
	ctx.status = 500;
	ctx.body = {error: 'Method Not Allowed'};
});

/**
 *  update a bulk of timeseries
 * route:					/datasets/{id}/timeseries
 * method type: 	PUT
 */
timeseriesRouter.put('/', KoaBody(), async (ctx) => {
	await timeseriesController.updateTimeseries(ctx);
});

/**
 * update a specific timeseries
 * route:					/datasets/{id}/timeseries/:id
 * method type: 	PUT
 */
timeseriesRouter.put('/:id', KoaBody(), async (ctx) => {
	await timeseriesController.updateTimeserieById(ctx);
});

/**
 * delete all timeseries
 * route:					/datasets/{id}/timeseries
 * method type: 	DELETE
 */
timeseriesRouter.del('/', async (ctx) => {
	await timeseriesController.deleteTimeseries(ctx);
});

/**
 * delete a specific timeserie
 * route:					/datasets/{id}/Timeseries/:id
 * method type: 	DELETE
 */
timeseriesRouter.del('/:id', async (ctx) => {
	await timeseriesController.deleteTimeserieById(ctx);
});


module.exports = timeseriesRouter;
