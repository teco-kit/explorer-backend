const Router        = require('koa-router');
const Config        = require('config');
const KoaBodyParser = require('koa-bodyparser');
const Mongoose      = require('mongoose');
const JsonValidate  = require('jsonschema').validate;

const model = {
	Dataset: require('../models/dataset').model,
	Analysis: require('../models/analysis').model,
	Annotation: require('../models/annotation').model,
};

// parse config
const config       = Config.get('server');

/*
 * GET  /analyses
 * GET  /analyses/<id>
 * POST /analyses/<id>
 * GET  /analyses/<id>/annotation
 * POST /analyses/<id>/anotation
 */


// mounted at /dataset
const analysesRouter = new Router();

analysesRouter.get('/', async (ctx) => {
	// list analyses for user and return JSON
	const analyses = [];

	// find all analyses for current user
	const analysesFound = await model.Analysis.find({
		user: ctx.state.user.doc._id,
	}, {
		id: 1,
		meta: 1,
		annotations: 1,
		state: 1,
		_id: 0,
	}).populate({
		path: 'annotations',
		select: '-bands._id -_id',
	});

	ctx.body = analysesFound;
});

analysesRouter.get('/:id', async (ctx) => {
	const analysisId = ctx.params.id.split('x')[1];

	// get analysis with matching id and return
	const analyses = [];

	// find all analyses for current user
	const analysesFound = await model.Analysis.findOne({
		user: ctx.state.user.doc._id,
		id: analysisId,
	}, {
		id: 1,
		meta: 1,
		annotations: 1,
		state: 1,
		_id: 0,
	}).populate({
		path: 'annotations',
		select: '-bands._id -_id',
	});

	ctx.body = analysesFound;
});

// annotate dataset
analysesRouter.post('/:id', KoaBodyParser(), async (ctx) => {
	const res = JsonValidate(ctx.request.body, {
		type: 'array',
		items: {
			type: 'object',
			properties: {
				from: {type: 'date-time'},
				to: {type: 'date-time'},
				state: {
					type: 'string',
					enum: ['apnea', 'hypopnea', 'noise'],
				}
			}
		},
	});

	if(!res.valid){
		ctx.status = 415;
		ctx.body = {success: false, message: 'Invalid Schema'};
	}

	const annotation = await model.Annotation.create({
		type: 'manual',
		bands: ctx.request.body,
	});

	await model.Analysis.findOneAndUpdate({id: ctx.params.id.split('x')[1]}, {
		$push: {
			annotations: annotation._id
		}
	});

	ctx.body = {success: true, message: 'annotation saved'};
});

analysesRouter.get('/:id/result', async (ctx) => {
	const analysis = await model.Analysis.findOne({
		user: ctx.state.user.doc._id,
		id: ctx.params.id.split('x')[1]
	}).populate('annotations').populate('dataset');

	if(analysis.annotations.length === 0){
		ctx.status = 202;
		ctx.body = {success: false, message: 'no annotations found'};
		return;
	}

	const annotation = analysis.annotations[analysis.annotations.length - 1];

	// set starttime to closest smaller 10 minute interval
	const start = analysis.dataset.startTime - (analysis.dataset.startTime % 6e5);

	const bands = [];

	for(const band of annotation.bands) {
		// calculate delta in hours
		const delta = (band.from - start) / (3.6e6 / 6); // bin size 10 minutes
		const bin = parseInt(delta, 10);
		bands[bin] = bands[bin] || [];
		bands[bin].push(band);
	}

	const res = {
		startTime: analysis.dataset.startTime,
		result: {
			apnea: Array(bands.length),
			hypopnea: Array(bands.length),
			noise: Array(bands.length),
			sleepScore: 50, // TODO: implement
			sleepTime: 1231342324, // TODO: implememnt as milliseconds
			averageAHI: 20, // TODO: implement
		}
	};

	for(const [i, bin] of bands.entries()){
		for(const type of Object.keys(res.result)){
			res.result[type][i] = bin.filter(elem => elem.state === type).length;
		}
	}

	ctx.body = res;
});

module.exports = analysesRouter;
