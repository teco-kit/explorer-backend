// get model
const DatasetModel = require('../models/dataset').model;
const LabelingModel = require('../models/datasetLabeling').model;
/**
 * get all labelings
 */
async function getLabelings(ctx) {
	try {
		const dataset = await DatasetModel.findById(ctx.params.datasetId);
		ctx.body = dataset.labelings;
		ctx.status = 200;
		return ctx;
	} catch (error) {
		ctx.body = {error: error.message};
		ctx.status = 500;
		return ctx;
	}
}

/**
 * get labeling by id
 */
async function getLabelingById(ctx) {
	try {
		const {labelings} = await DatasetModel.findById(ctx.params.datasetId);
		const labeling = await labelings.id(ctx.params.id);
		ctx.body = labeling;
		ctx.status = 200;
		return ctx;
	} catch (error) {
		ctx.body = {error: error.message};
		ctx.status = 500;
		return ctx;
	}
}

/**
 * create a new labeling
 */
async function createLabeling(ctx) {
	try {
		const dataset = await DatasetModel.findById(ctx.params.datasetId);
		const labeling = new LabelingModel(ctx.request.body);
		await dataset.labelings.push(labeling);
		await dataset.save();
		ctx.body = labeling;
		ctx.status = 201;
		return ctx;
	} catch (error) {
		ctx.body = {error: error.message};
		ctx.status = 500;
		return ctx;
	}
}

/**
 * update a bulk of labelings
 */
async function updateLabelings(ctx) {
	// TODO: wie spezifizieren?
	ctx.body = {error: 'Not Implemented'};
	ctx.status = 501;
	return ctx;
}

/**
 * update a specific labeling
 */
async function updateLabelingById(ctx) {
	try {
		await DatasetModel.updateOne(
			{ _id: ctx.params.datasetId, 'labelings._id': ctx.params.id },
			{'labelings.$': ctx.request.body},
			{new: true},
			(error) => {
				if(error) {
					ctx.body = {error: error.message};
					ctx.status = 500;
					return ctx;
				}
			}
		);
		ctx.body = {message: `updated labeling with id: ${ctx.params.id}`};
		ctx.status = 200;
		return ctx;
	} catch (error) {
		ctx.body = {error: error.message};
		ctx.status = 500;
		return ctx;
	}
}

/**
 * delete all labelings
 */
async function deleteLabelings(ctx) {
	try {
		const dataset = await DatasetModel.findById(ctx.params.datasetId);
		await dataset.set({labelings: []});
		await dataset.save();
		ctx.body = {message: 'deleted all labelings'};
		ctx.status = 200;
		return ctx;
	} catch (error) {
		ctx.body = {error: error.message};
		ctx.status = 500;
		return ctx;
	}
}

/**
 * delete a specific labeling
 */
async function deleteLabelingById(ctx) {
	try {
		const dataset = await DatasetModel.findById(ctx.params.datasetId);
		await dataset.labelings.id(ctx.params.id).remove();
		await dataset.save();
		ctx.body = {message: `deleted labeling with id: ${ctx.params.id}`};
		ctx.status = 200;
		return ctx;
	} catch (error) {
		ctx.body = {error: error.message};
		ctx.status = 500;
		return ctx;
	}
}

module.exports = {
	getLabelings,
	getLabelingById,
	createLabeling,
	updateLabelings,
	updateLabelingById,
	deleteLabelings,
	deleteLabelingById
};
