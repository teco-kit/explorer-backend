// get model
const Model = require('../models/labelType').model;

/**
 * get all labels
 */
async function getLabels(ctx) {
	try {
		const result = await Model.find({});
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
 * get label by id
 */
async function getLabelById(ctx) {
	try {
		const result = await Model.findById(ctx.params.id);
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
 * create a new label
 */
async function createLabel(ctx) {
	try {
		const document = new Model(ctx.request.body);
		const result = await document.save();
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
		await Model.findByIdAndUpdate(ctx.params.id, {$set: ctx.request.body});
		ctx.body = {message: `updated label type with id: ${ctx.params.id}`};
		ctx.status = 200;
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
		await Model.deleteMany({});
		ctx.body = {message: 'deleted all label types'};
		ctx.status = 200;
		return ctx;
	} catch (error) {
		ctx.body = {error: error.message};
		ctx.status = 500;
		return ctx;
	}}

/**
 * delete a specific label
 */
async function deleteLabelById(ctx) {
	try {
		await Model.findByIdAndDelete(ctx.params.id);
		ctx.body = {message: `deleted label type with id: ${ctx.params.id}`};
		ctx.status = 200;
		return ctx;
	} catch (error) {
		ctx.body = {error: error.message};
		ctx.status = 500;
		return ctx;
	}}

module.exports = {
	getLabels,
	getLabelById,
	createLabel,
	updateLabels,
	updateLabelById,
	deleteLabels,
	deleteLabelById
};
