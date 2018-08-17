const Router    = require('koa-router');

const model = {
	Dataset: require('../models/dataset').model,
	Analysis: require('../models/analysis').model,
};

// mounted at /dataset
const datasetRouter = new Router();

datasetRouter.post('/submit', async (ctx) => {
	ctx.body = {success: 'true', state: 0};
	const dataset = await model.Dataset.create(ctx.request.body);
	const analysis = await model.Analysis.create({
		user: ctx.state.user.doc._id,
		dataset: dataset._id,
	});
	console.log(`New Dataset: ${dataset._id.toString()}, New Analysis: ${analysis._id.toString()}`);
});

module.exports = datasetRouter;
