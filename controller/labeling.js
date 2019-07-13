// get model
const Model = require('../models/labeling').model;

/**
 * get all labelings
 */
async function getLabelings(ctx) {
	try {
		const result = await Model.find({});
		if(!result.length) {
			throw new Error();
		} else {
			ctx.body = {data: result};
			ctx.status = 200;
		}
		return ctx;
	} catch (error) {
		ctx.body = {error: `no labelings found`};
		ctx.status = 404;
		return ctx;
	}
}

/**
 * get labeling by id
 */
async function getLabelingById(ctx) {
	try {
		const result = await Model.findById(ctx.params.id);
		if(!result) {
			throw new Error();
		} else {
			ctx.body = {data: result};
			ctx.status = 200;
			return ctx.body;
		}
	} catch (error) {
		ctx.body = {error: `labeling with id '${ctx.params.id}' not found`};
		ctx.status = 404;
		return ctx;
	}
}

/**
 * create a new labeling
 */
async function createLabeling(ctx) {
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
 * update a bulk of labelings
 */
async function updateLabelings(ctx) {
	// TODO: wie spezifizieren?
	ctx.body = {error: 'Not Implemented'};
	ctx.status = 501;
	return ctx;
}

/**
 * update a labeling specified by id
 */
async function updateLabelingById(ctx) {
	try {
		await Model.findByIdAndUpdate(ctx.params.id, {$set: ctx.request.body});
		ctx.body = {message: `updated labeling with id: ${ctx.params.id}`};
		ctx.status = 200;
		return ctx;
	} catch (error) {
		ctx.body = {error: `labeling with id '${ctx.params.id}' not found`};
		ctx.status = 404;
		return ctx;
	}
}

/**
 * delete all labelings
 */
async function deleteLabelings(ctx) {
	try {
		await Model.deleteMany({});
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
 * delete a labeling specified by id
 */
async function deleteLabelingById(ctx) {
	try {
		await Model.findByIdAndDelete(ctx.params.id);
		ctx.body = {message: `deleted labeling with id: ${ctx.params.id}`};
		ctx.status = 200;
		return ctx;
	} catch (error) {
		ctx.body = {error: `labeling with id '${ctx.params.id}' not found`};
		ctx.status = 404;
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
