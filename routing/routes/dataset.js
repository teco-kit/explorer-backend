const Router      = require('koa-router');
const KoaBody      = require('koa-body');

// import controller
const datasetController = require('../../controller/dataset');

// mounted at /datasets
const datasetRouter = new Router();

/*
* SUBROUTES
* */

// subroutes to be mounted
const subroutes = {
	result: require('./subroutes/result'),
	event: require('./subroutes/event'),
	labeling: require('./subroutes/labeling'),
	label: require('./subroutes/label'),
	video: require('./subroutes/video'),
	timeseries: require('./subroutes/timeseries'),
	fusedseries: require('./subroutes/fusedseries')
};

// routes for /datasets/{id}/results
datasetRouter.use('/:datasetId/results', subroutes.result.routes(), subroutes.result.allowedMethods());

// routes for /datasets/{id}/events
datasetRouter.use('/:datasetId/events', subroutes.event.routes(), subroutes.event.allowedMethods());

// routes for /datasets/{id}/labelings
datasetRouter.use('/:datasetId/labelings', subroutes.labeling.routes(), subroutes.labeling.allowedMethods());

// routes for /datasets/{id}/labelings/{id}/labels
datasetRouter.use('/:datasetId/labelings/:labelingId/labels', subroutes.label.routes(), subroutes.label.allowedMethods());

// routes for /datasets/{id}/video
datasetRouter.use('/:datasetId/video', subroutes.video.routes(), subroutes.video.allowedMethods());

// routes for /datasets/{id}/timeseries
datasetRouter.use('/:datasetId/timeseries', subroutes.timeseries.routes(), subroutes.timeseries.allowedMethods());

// routes for /datasets/{id}/fusedseries
datasetRouter.use('/:datasetId/fusedseries', subroutes.fusedseries.routes(), subroutes.fusedseries.allowedMethods());


/*
* MAIN ROUTES
* */

/**
 * get all datasets for current user
 * route:					/datasets
 * method type: 	GET
 */
datasetRouter.get('/', async (ctx) => {
	await datasetController.getDatasets(ctx);
});

/**
 * get dataset by id for current user
 * route:					/datasets/:id
 * method type: 	GET
 */
datasetRouter.get('/:id', async (ctx) => {
	console.log(ctx.params.id);
	await datasetController.getDatasetById(ctx);
});

/**
 * create a new dataset
 * route:					/datasets
 * method type: 	POST
 */
datasetRouter.post('/', KoaBody(), async (ctx) => {
	await datasetController.createDataset(ctx);
});

/**
 * for handling requests that try to POST a new dataset
 * with id -> Method not allowed (405)
 * route:					/datasets/:id
 * method type: 	POST
 */
datasetRouter.post('/:id', async (ctx) => {
	ctx.status = 500;
	ctx.body = {error: 'Method Not Allowed'};
});

/**
 *  update a bulk of datasets
 * route:					/datasets
 * method type: 	PUT
 */
datasetRouter.put('/', KoaBody(), async (ctx) => {
	await datasetController.updateDatasets(ctx);
});

/**
 * update a specific datasets
 * route:					/datasets/:id
 * method type: 	PUT
 */
datasetRouter.put('/:id', KoaBody(), async (ctx) => {
	await datasetController.updateDatasetById(ctx);
});

/**
 * delete all datasets
 * route:					/datasets
 * method type: 	DELETE
 */
datasetRouter.del('/', async (ctx) => {
	await datasetController.deleteDatasets(ctx);
});

/**
 * delete a specific dataset
 * route:					/datasets/:id
 * method type: 	DELETE
 */
datasetRouter.del('/:id', async (ctx) => {
	await datasetController.deleteDatasetById(ctx);
});


module.exports = datasetRouter;
