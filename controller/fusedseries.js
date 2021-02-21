const DatasetModel = require("../models/dataset").model;
const Model = require("../models/fusedSeries").model;
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
 * get all fusedseries
 */
async function getFusedseries(ctx) {
	if (!(await checkAccess(ctx))) {
		return ctx;
	}
	const dataset = await DatasetModel.findById(ctx.params.datasetId);
	ctx.body = dataset.fusedSeries;
	ctx.status = 200;
	return ctx;
}

/**
 * get fusedserie by id
 */
async function getFusedserieById(ctx) {
	if (!(await checkAccess(ctx))) {
		return ctx;
	}
	const { fusedSeries } = await DatasetModel.findById(ctx.params.datasetId);
	const fs = await fusedSeries.id(ctx.params.id);
	ctx.body = fs;
	ctx.status = 200;
	return ctx;
}

/**
 * create a new fusedserie
 */
async function createFusedserie(ctx) {
	if (!(await checkAccess(ctx))) {
		return ctx;
	}
	const dataset = await DatasetModel.findById(ctx.params.datasetId);
	const fs = new Model(ctx.request.body);
	await dataset.fusedSeries.push(fs);
	await dataset.save();
	ctx.body = fs;
	ctx.status = 201;
	return ctx;
}

/**
 * update a specific fusedserie
 */
async function updateFusedserieById(ctx) {
	if (!(await checkAccess(ctx))) {
		return ctx;
	}
	const dataset = await DatasetModel.findById(ctx.params.datasetId);
	const { fusedSeries } = dataset;
	const updateFS = await fusedSeries.id(ctx.params.id);
	await updateFS.set(ctx.request.body);
	await dataset.save();
	ctx.body = { message: `updated fusedseries with id: ${ctx.params.id}` };
	ctx.status = 200;
	return ctx;
}

/**
 * delete all fusedseries
 */
async function deleteFusedseries(ctx) {
	if (!(await checkAccess(ctx))) {
		return ctx;
	}
	const dataset = await DatasetModel.findById(ctx.params.datasetId);
	await dataset.set({ fusedSeries: [] });
	await dataset.save();
	ctx.body = { message: "deleted all fusedseries" };
	ctx.status = 200;
	return ctx;
}

/**
 * delete a specific fusedserie
 */
async function deleteFusedserieById(ctx) {
	if (!(await checkAccess(ctx))) {
		return ctx;
	}
	const dataset = await DatasetModel.findById(ctx.params.datasetId);
	await dataset.fusedSeries.id(ctx.params.id).remove();
	await dataset.save();
	ctx.body = { message: `deleted fusedseries with id: ${ctx.params.id}` };
	ctx.status = 200;
	return ctx;
}

module.exports = {
	getFusedseries,
	getFusedserieById,
	createFusedserie,
	updateFusedserieById,
	deleteFusedseries,
	deleteFusedserieById,
};
