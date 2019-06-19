// get model
const DatasetModel = require('../models/dataset').model;
const ResultModel = require('../models/result').model;

/**
 * get all results
 */
async function getResults(ctx) {
	try {
		const dataset = await DatasetModel.findById(ctx.params.datasetId);
		ctx.body = {data: dataset.results};
		ctx.status = 200;
		return ctx;
	} catch (error) {
		ctx.body = {error: error.message};
		ctx.status = 500;
		return ctx;
	}
}

/**
 * get result by id
 */
async function getResultById(ctx) {
	try {
		const {results} = await DatasetModel.findById(ctx.params.datasetId);
		const result = await results.id(ctx.params.id);
		ctx.body = {data: result};
		ctx.status = 200;
		return ctx;
	} catch (error) {
		ctx.body = {error: error.message};
		ctx.status = 500;
		return ctx;
	}
}

/**
 * create a new result
 */
async function createResult(ctx) {
	try {
		const dataset = await DatasetModel.findById(ctx.params.datasetId);
		const result = new ResultModel(ctx.request.body);
		await dataset.results.push(result);
		await dataset.save();
		ctx.body = {data: result};
		ctx.status = 201;
		return ctx;
	} catch (error) {
		ctx.body = {error: error.message};
		ctx.status = 500;
		return ctx;
	}
}

/**
 * update a bulk of results
 */
async function updateResults(ctx) {
	// TODO: wie spezifizieren?
	ctx.body = {error: 'Not Implemented'};
	ctx.status = 501;
	return ctx;
}

/**
 * update a specific result
 */
async function updateResultById(ctx) {
	try {
		const dataset = await DatasetModel.findById(ctx.params.datasetId);
		const {results} = dataset;
		const updateResult = await results.id(ctx.params.id);
		await updateResult.set(ctx.request.body);
		await dataset.save();
		ctx.body = {message: `updated result with id: ${ctx.params.datasetId}`};
		ctx.status = 200;
		return ctx;
	} catch (error) {
		ctx.body = {error: error.message};
		ctx.status = 500;
		return ctx;
	}
}

/**
 * delete all results
 */
async function deleteResults(ctx) {
	try {
		const dataset = await DatasetModel.findById(ctx.params.datasetId);
		await dataset.set({results: []});
		await dataset.save();
		ctx.body = {message: 'deleted all results'};
		ctx.status = 200;
		return ctx;
	} catch (error) {
		ctx.body = {error: error.message};
		ctx.status = 500;
		return ctx;
	}
}

/**
 * delete a specific result
 */
async function deleteResultById(ctx) {
	try {
		const dataset = await DatasetModel.findById(ctx.params.datasetId);
		await dataset.results.id(ctx.params.id).remove();
		await dataset.save();
		ctx.body = {message: `deleted event type with id: ${ctx.params.datasetId}`};
		ctx.status = 200;
		return ctx;
	} catch (error) {
		ctx.body = {error: error.message};
		ctx.status = 500;
		return ctx;
	}
}

module.exports = {
	getResults,
	getResultById,
	createResult,
	updateResults,
	updateResultById,
	deleteResults,
	deleteResultById
};
