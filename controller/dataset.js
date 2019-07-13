// get model
const Model = require('../models/dataset').model;

/**
 * get all datasets
 */
async function getDatasets(ctx) {
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
		ctx.body = {error: `no datasets found`};
		ctx.status = 404;
		return ctx;
	}
}

/**
 * get dataset by id
 */
async function getDatasetById(ctx) {
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
		ctx.body = {error: `dataset with id '${ctx.params.id}' not found`};
		ctx.status = 404;
		return ctx;
	}
}

/**
 * create a new dataset
 */
async function createDataset(ctx) {
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
 * update a bulk of datasets
 */
async function updateDatasets(ctx) {
	// TODO: wie spezifizieren?
	ctx.body = {error: 'Not Implemented'};
	ctx.status = 501;
	return ctx;
}

/**
 * update a dataset specified by id
 */
async function updateDatasetById(ctx) {
	try {
		await Model.findByIdAndUpdate(ctx.params.id, {$set: ctx.request.body});
		ctx.body = {message: `updated dataset with id: ${ctx.params.id}`};
		ctx.status = 200;
		return ctx;
	} catch (error) {
		ctx.body = {error: `dataset with id '${ctx.params.id}' not found`};
		ctx.status = 404;
		return ctx;
	}
}

/**
 * delete all datasets
 */
async function deleteDatasets(ctx) {
	try {
		await Model.deleteMany({});
		ctx.body = {message: 'deleted all datasets'};
		ctx.status = 200;
		return ctx;
	} catch (error) {
		ctx.body = {error: error.message};
		ctx.status = 500;
		return ctx;
	}
}

/**
 * delete a dataset specified by id
 */
async function deleteDatasetById(ctx) {
	try {
		await Model.findByIdAndDelete(ctx.params.id);
		ctx.body = {message: `deleted dataset with id: ${ctx.params.id}`};
		ctx.status = 200;
		return ctx;
	} catch (error) {
		ctx.body = {error: `dataset with id '${ctx.params.id}' not found`};
		ctx.status = 404;
		return ctx;
	}
}

module.exports = {
	getDatasets,
	getDatasetById,
	createDataset,
	updateDatasets,
	updateDatasetById,
	deleteDatasets,
	deleteDatasetById
};
