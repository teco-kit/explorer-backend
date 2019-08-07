// get model
const Model = require('../models/labelType').model;

/**
 * get all labels
 */
async function getLabels(ctx) {
	try {
		const result = await Model.find({});
		if(!result.length) {
			throw new Error();
		} else {
			ctx.body = result;
			ctx.status = 200;
		}
		return ctx;
	} catch (error) {
		ctx.body = {error: `no labels found`};
		ctx.status = 404;
		return ctx;
	}
}

/**
 * get label by id
 */
async function getLabelById(ctx) {
	try {
		const result = await Model.findById(ctx.params.id);
		if(!result) {
			throw new Error();
		} else {
			ctx.body = result;
			ctx.status = 200;
			return ctx.body;
		}
	} catch (error) {
		ctx.body = {error: `label with id '${ctx.params.id}' not found`};
		ctx.status = 404;
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
		ctx.body = result;
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
	return ctx;
}

/**
 * update a label specified by id
 */
async function updateLabelById(ctx) {
	try {
		await Model.findByIdAndUpdate(ctx.params.id, {$set: ctx.request.body});
		ctx.body = {message: `updated label with id: ${ctx.params.id}`};
		ctx.status = 200;
		return ctx;
	} catch (error) {
		ctx.body = {error: `label with id '${ctx.params.id}' not found`};
		ctx.status = 404;
		return ctx;
	}
}

/**
 * delete all labels
 */
async function deleteLabels(ctx) {
	try {
		await Model.deleteMany({});
		ctx.body = {message: 'deleted all labels'};
		ctx.status = 200;
		return ctx;
	} catch (error) {
		ctx.body = {error: error.message};
		ctx.status = 500;
		return ctx;
	}
}

/**
 * delete a label specified by id
 */
async function deleteLabelById(ctx) {
	try {
		await Model.findByIdAndDelete(ctx.params.id);
		ctx.body = {message: `deleted label with id: ${ctx.params.id}`};
		ctx.status = 200;
		return ctx;
	} catch (error) {
		ctx.body = {error: `label with id '${ctx.params.id}' not found`};
		ctx.status = 404;
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
