// get model
const DatasetModel = require('../models/dataset').model;
const LabelModel = require('../models/label').model;

/**
 * get all labels
 */
async function getLabels(ctx) {
	try {
		const {labelings} = await DatasetModel.findById(ctx.params.datasetId);
		const {labels} = await labelings.id(ctx.params.labelingId);
		ctx.body = {data: labels};
		ctx.status = 201;
		return ctx;
	} catch (error) {
		ctx.body = {error: error.message};
		ctx.status = 500;
		return ctx;
	}
}

/**
 * get label by id
 */
async function getLabelById(ctx) {
	try {
		const {labelings} = await DatasetModel.findById(ctx.params.datasetId);
		const label = await labelings.id(ctx.params.labelingId).id(ctx.params.id);
		ctx.body = {data: label};
		ctx.status = 201;
		return ctx;
	} catch (error) {
		ctx.body = {error: error.message};
		ctx.status = 500;
		return ctx;
	}
}

/**
 * create a new label
 */
async function createLabel(ctx) {
	try {
		const dataset = await DatasetModel.findById(ctx.params.datasetId);
		const labeling = dataset.labelings.id(ctx.params.labelingId);
		// TODO: validate time by hand, validate label nesting
		// -> cannot access parent here since no parent defined yet
		const label = new LabelModel(ctx.request.body);
		await labeling.labels.push(label);
		await dataset.save();
		ctx.body = {data: label};
		ctx.status = 201;
		return ctx;
	} catch (error) {
		ctx.body = {error: error.message};
		ctx.status = 500;
		return ctx;
	}
}

/**
 * update a bulk of labels
 */
async function updateLabels(ctx) {
	// TODO: wie spezifizieren?
	ctx.body = {error: 'Not Implemented'};
	ctx.status = 501;
	return ctx;}

/**
 * update a specific label
 */
async function updateLabelById(ctx) {
	try {
		const dataset = await DatasetModel.findById(ctx.params.datasetId);
		const labeling = dataset.labelings.id(ctx.params.labelingId);
		const updateLabel = await labeling.id(ctx.params.id);
		await updateLabel.set(ctx.request.body);
		await dataset.save();
		ctx.body = {message: `updated label with id: ${ctx.params.id}`};
		ctx.status = 201;
		return ctx;
	} catch (error) {
		ctx.body = {error: error.message};
		ctx.status = 500;
		return ctx;
	}
}

/**
 * delete all labels
 */
async function deleteLabels(ctx) {
	try {
		const dataset = await DatasetModel.findById(ctx.params.datasetId);
		const labeling = dataset.labelings.id(ctx.params.labelingId);
		await labeling.set({labels: []});
		await dataset.save();
		ctx.body = {message: 'deleted all labels'};
		ctx.status = 201;
		return ctx;
	} catch (error) {
		ctx.body = {error: error.message};
		ctx.status = 500;
		return ctx;
	}
}

/**
 * delete a specific label
 */
async function deleteLabelById(ctx) {
	try {
		const dataset = await DatasetModel.findById(ctx.params.datasetId);
		const labeling = await dataset.labelings.id(ctx.params.labelingId);
		await labeling.labels.id(ctx.params.id).remove();
		await dataset.save();
		ctx.body = {message: `deleted label with id: ${ctx.params.id}`};
		ctx.status = 201;
		return ctx;
	} catch (error) {
		ctx.body = {error: error.message};
		ctx.status = 500;
		return ctx;
	}
}

module.exports = {
	getLabels,
	getLabelById,
	createLabel,
	updateLabels,
	updateLabelById,
	deleteLabels,
	deleteLabelById
};
