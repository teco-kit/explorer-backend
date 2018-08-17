const Router    = require('koa-router');

const model = {
	Dataset: require('../models/dataset').model,
};

// mounted at /dataset
const datasetRouter = new Router();

datasetRouter.post('/submit', (ctx) => {
	const dataset = new model.Dataset(ctx.request.body);

	dataset.save().then(() => console.log(`New Dataset added to queue: ${ctx.request.body.samples} samples, mongo ID: ${dataset._id.toString()}`));

	ctx.body = {success: 'true', id: dataset._id.toString()};
});

module.exports = datasetRouter;
