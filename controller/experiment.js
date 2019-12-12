const Model = require('../models/experiment').model;

/**
 * get all experiments
 */
async function getExperiments(ctx) {
	ctx.body = await Model.find({});
	ctx.status = 200;
	return ctx;
}

/**
 * get experiment by id
 */
async function getExperimentById(ctx) {
	ctx.body = await Model.findById(ctx.params.id);
	ctx.status = 200;
	return ctx;
}

/**
 * create a new experiment
 */
async function createExperiment(ctx) {
	const document = new Model(ctx.request.body);
	await document.save();

	ctx.body = document;
	ctx.status = 201;
	return ctx;
}

/**
 * update a experiment specified by id
 */
async function updateExperimentById(ctx) {
	await Model.findByIdAndUpdate(ctx.params.id, {$set: ctx.request.body});
	ctx.body = {message: `updated experiment with id: ${ctx.params.id}`};
	ctx.status = 200;
	return ctx;
}

/**
 * delete all experiments
 */
async function deleteExperiments(ctx) {
	await Model.deleteMany({});
	ctx.body = {message: 'deleted all experiments'};
	ctx.status = 200;
	return ctx;
}

/**
 * delete a experiment specified by id
 */
async function deleteExperimentById(ctx) {
	await Model.findOneAndDelete(ctx.params.id);
	ctx.body = {message: `deleted experiment with id: ${ctx.params.id}`};
	ctx.status = 200;
	return ctx;
}

module.exports = {
	getExperiments,
	getExperimentById,
	createExperiment,
	updateExperimentById,
	deleteExperiments,
	deleteExperimentById
};
