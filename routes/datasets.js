const Router        = require('koa-router');
const Config        = require('config');

const model = {
	Dataset: require('../models/dataset').model,
	Analysis: require('../models/analysis').model,
	Annotation: require('../models/annotation').model,
};

const proto = require('../protocol');

// mounted at /datasets
const datasetsRouter = new Router();

// assert admin
datasetsRouter.use(async (ctx, next) => {
	if(ctx.state.user.doc.role !== 'admin'){
		console.log(`User ${ctx.state.user.nickname} is not an Admin!`);
		ctx.status = 401;
	}else{
		await next();
	}
});

datasetsRouter.get('/', async (ctx) => {
	const analyses = await model.Analysis.find({}).populate('dataset').populate('user').populate('annotation');

	ctx.body = analyses;
});

module.exports = datasetsRouter;
