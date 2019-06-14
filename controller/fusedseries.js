// get model
const DatasetModel = require('../models/dataset').model;
const FSModel = require('../models/fusedSeries').model;

/**
 * get all fusedseries
 */
async function getFusedseries(ctx) {
	try {
		const dataset = await DatasetModel.findById(ctx.params.datasetId);
		ctx.body = {data: dataset.fusedSeries};
		ctx.status = 201;
		return ctx;
	} catch (error) {
		ctx.body = {error: error.message};
		ctx.status = 500;
		return ctx;
	}
}

/**
 * get fusedserie by id
 */
async function getFusedserieById(ctx) {
	try {
		const {fusedSeries} = await DatasetModel.findById(ctx.params.datasetId);
		const fs = await fusedSeries.id(ctx.params.id);
		ctx.body = {data: fs};
		ctx.status = 201;
		return ctx;
	} catch (error) {
		ctx.body = {error: error.message};
		ctx.status = 500;
		return ctx;
	}
}

/**
 * create a new fusedserie
 */
async function createFusedserie(ctx) {
	try {
		const dataset = await DatasetModel.findById(ctx.params.datasetId);
		const fs = new FSModel(ctx.request.body);
		await dataset.fusedSeries.push(fs);
		await dataset.save();
		ctx.body = {data: fs};
		ctx.status = 201;
		return ctx;
	} catch (error) {
		ctx.body = {error: error.message};
		ctx.status = 500;
		return ctx;
	}
}

/**
 * update a bulk of fusedseries
 */
async function updateFusedseries(ctx) {
	// TODO: wie spezifizieren?
	ctx.body = {error: 'Not Implemented'};
	ctx.status = 501;
	return ctx;}

/**
 * update a specific fusedserie
 */
async function updateFusedserieById(ctx) {
	try {
		const dataset = await DatasetModel.findById(ctx.params.datasetId);
		const {fusedSeries} = dataset;
		const updateFS = await fusedSeries.id(ctx.params.id);
		await updateFS.set(ctx.request.body);
		await dataset.save();
		ctx.body = {message: `updated fusedSeries with id: ${ctx.params.id}`};
		ctx.status = 201;
		return ctx;
	} catch (error) {
		ctx.body = {error: error.message};
		ctx.status = 500;
		return ctx;
	}
}

/**
 * delete all fusedseries
 */
async function deleteFusedseries(ctx) {
	try {
		const dataset = await DatasetModel.findById(ctx.params.datasetId);
		await dataset.set({fusedSeries: []});
		await dataset.save();
		ctx.body = {message: 'deleted all fusedSeries'};
		ctx.status = 201;
		return ctx;
	} catch (error) {
		ctx.body = {error: error.message};
		ctx.status = 500;
		return ctx;
	}
}

/**
 * delete a specific fusedserie
 */
async function deleteFusedserieById(ctx) {
	try {
		const dataset = await DatasetModel.findById(ctx.params.datasetId);
		await dataset.fusedSeries.id(ctx.params.id).remove();
		await dataset.save();
		ctx.body = {message: `deleted fusedSeries with id: ${ctx.params.id}`};
		ctx.status = 201;
		return ctx;
	} catch (error) {
		ctx.body = {error: error.message};
		ctx.status = 500;
		return ctx;
	}
}

module.exports = {
	getFusedseries,
	getFusedserieById,
	createFusedserie,
	updateFusedseries,
	updateFusedserieById,
	deleteFusedseries,
	deleteFusedserieById
};
