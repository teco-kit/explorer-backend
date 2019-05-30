const Router      = require('koa-router');
const KoaBody      = require('koa-body');

// import controller
const datasetController = require('../controller/datasetController');

// mounted at /datasets
const datasetRouter = new Router();

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
