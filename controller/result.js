// get model
const DatasetModel = require('../models/dataset').model;
const ResultModel = require('../models/result').model;

/**
 * get all results
 */
async function getResults(ctx) {
	const dataset = await DatasetModel.findById(ctx.params.datasetId);
	ctx.body = dataset.results;
	ctx.status = 200;
	return ctx;
}

/**
 * get result by id
 */
async function getResultById(ctx) {
	const {results} = await DatasetModel.findById(ctx.params.datasetId);
	ctx.body = await results.id(ctx.params.id);
	ctx.status = 200;
	return ctx;
}

/**
 * create a new result
 */
async function createResult(ctx) {
	const dataset = await DatasetModel.findById(ctx.params.datasetId);
	const result = new ResultModel(ctx.request.body);
	await dataset.results.push(result);
	await dataset.save();
	ctx.body = result;
	ctx.status = 201;
	return ctx;
}

/**
 * update a specific result
 */
async function updateResultById(ctx) {
	const dataset = await DatasetModel.findById(ctx.params.datasetId);
	const {results} = dataset;
	const updateResult = await results.id(ctx.params.id);
	await updateResult.set(ctx.request.body);
	await dataset.save();
	ctx.body = {message: `updated result with id: ${ctx.params.datasetId}`};
	ctx.status = 200;
	return ctx;
}

/**
 * delete all results
 */
async function deleteResults(ctx) {
	const dataset = await DatasetModel.findById(ctx.params.datasetId);
	await dataset.set({results: []});
	await dataset.save();
	ctx.body = {message: 'deleted all results'};
	ctx.status = 200;
	return ctx;
}

/**
 * delete a specific result
 */
async function deleteResultById(ctx) {
	const dataset = await DatasetModel.findById(ctx.params.datasetId);
	await dataset.results.id(ctx.params.id).remove();
	await dataset.save();
	ctx.body = {message: `deleted event type with id: ${ctx.params.datasetId}`};
	ctx.status = 200;
	return ctx;
}

module.exports = {
	getResults,
	getResultById,
	createResult,
	updateResultById,
	deleteResults,
	deleteResultById
};
