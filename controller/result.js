// get model
const DatasetModel = require("../models/dataset").model;
const ResultModel = require("../models/result").model;
const ProjectModel = require("../models/project").model;

async function checkAccess(ctx) {
	const project = await ProjectModel.findOne({
		_id: ctx.header.project,
		datasets: ctx.params.datasetId,
	});
	if (!project) {
		ctx.body = { error: "Access denied" };
		ctx.status = 403;
		return false;
	}
	return true;
}

/**
 * get all results
 */
async function getResults(ctx) {
	if (!await checkAccess(ctx)) {
		return ctx;
	}
	const dataset = await DatasetModel.findById(ctx.params.datasetId);
	ctx.body = dataset.results;
	ctx.status = 200;
	return ctx;
}

/**
 * get result by id
 */
async function getResultById(ctx) {
	if (!await checkAccess(ctx)) {
		return ctx;
	}
	const { results } = await DatasetModel.findById(ctx.params.datasetId);
	ctx.body = await results.id(ctx.params.id);
	ctx.status = 200;
	return ctx;
}

/**
 * create a new result
 */
async function createResult(ctx) {
	if (!await checkAccess(ctx)) {
		return ctx;
	}
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
	if (!await checkAccess(ctx)) {
		return ctx;
	}
	const dataset = await DatasetModel.findById(ctx.params.datasetId);
	const { results } = dataset;
	const updateResult = await results.id(ctx.params.id);
	await updateResult.set(ctx.request.body);
	await dataset.save();
	ctx.body = { message: `updated result with id: ${ctx.params.id}` };
	ctx.status = 200;
	return ctx;
}

/**
 * delete all results
 */
async function deleteResults(ctx) {
	if (!await checkAccess(ctx)) {
		return ctx;
	}
	const dataset = await DatasetModel.findById(ctx.params.datasetId);
	await dataset.set({ results: [] });
	await dataset.save();
	ctx.body = { message: "deleted all results" };
	ctx.status = 200;
	return ctx;
}

/**
 * delete a specific result
 */
async function deleteResultById(ctx) {
	if (!await checkAccess(ctx)) {
		return ctx;
	}
	const dataset = await DatasetModel.findById(ctx.params.datasetId);
	await dataset.results.id(ctx.params.id).remove();
	await dataset.save();
	ctx.body = { message: `deleted result with id: ${ctx.params.id}` };
	ctx.status = 200;
	return ctx;
}

module.exports = {
	getResults,
	getResultById,
	createResult,
	updateResultById,
	deleteResults,
	deleteResultById,
};
