const DatasetModel = require('../models/dataset').model;
const Model = require('../models/datasetLabeling').model;
const ProjectModel = require('../models/project').model;

async function checkAccess(ctx) {
	const project = await ProjectModel.findOne({ _id: ctx.header.project, datasets: ctx.params.datasetId });
	if (!project) {
		ctx.body = { error: 'Access denied' };
		ctx.status = 403;
		return false;
	}
	return true;
}

/**
 * get all labelings
 */
async function getLabelings(ctx) {
	if (!await checkAccess(ctx)) {
		return ctx;
	}
	const dataset = await DatasetModel.findById(ctx.params.datasetId);
	ctx.body = dataset.labelings;
	ctx.status = 200;
	return ctx;
}

/**
 * get labeling by id
 */
async function getLabelingById(ctx) {
	if (!await checkAccess(ctx)) {
		return ctx;
	}
	const { labelings } = await DatasetModel.findById(ctx.params.datasetId);
	ctx.body = await labelings.id(ctx.params.id);
	ctx.status = 200;
	return ctx;
}

/**
 * create a new labeling
 */
async function createLabeling(ctx) {
	if (!await checkAccess(ctx)) {
		return ctx;
	}
	const dataset = await DatasetModel.findById(ctx.params.datasetId);
	const labeling = new Model(ctx.request.body);
	await dataset.labelings.push(labeling);
	await dataset.save();
	ctx.body = labeling;
	ctx.status = 201;
	return ctx;
}

/**
 * update a specific labeling
 */
async function updateLabelingById(ctx) {
	if (!await checkAccess(ctx)) {
		return ctx;
	}
	const dataset = await DatasetModel.findById(ctx.params.datasetId);
	const { labelings } = dataset;
	const updatedLabeling = await labelings.id(ctx.params.id);
	await updatedLabeling.set(ctx.request.body);
	await dataset.save();
	ctx.body = { message: `updated labeling with id: ${ctx.params.id}` };
	ctx.status = 200;
	return ctx;
}

/**
 * delete all labelings
 */
async function deleteLabelings(ctx) {
	if (!await checkAccess(ctx)) {
		return ctx;
	}
	const dataset = await DatasetModel.findById(ctx.params.datasetId);
	await dataset.set({ labelings: [] });
	await dataset.save();
	ctx.body = { message: 'deleted all labelings' };
	ctx.status = 200;
	return ctx;
}

/**
 * delete a specific labeling
 */
async function deleteLabelingById(ctx) {
	if (!await checkAccess(ctx)) {
		return ctx;
	}
	const dataset = await DatasetModel.findById(ctx.params.datasetId);
	await dataset.labelings.id(ctx.params.id).remove();
	await dataset.save();
	ctx.body = { message: `deleted labeling with id: ${ctx.params.id}` };
	ctx.status = 200;
	return ctx;
}

module.exports = {
	getLabelings,
	getLabelingById,
	createLabeling,
	updateLabelingById,
	deleteLabelings,
	deleteLabelingById
};
