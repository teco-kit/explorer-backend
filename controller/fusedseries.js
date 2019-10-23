const DatasetModel = require('../models/dataset').model;
const Model = require('../models/fusedSeries').model;

/**
 * get all fusedseries
 */
async function getFusedseries(ctx) {
	const dataset = await DatasetModel.findById(ctx.params.datasetId);
	ctx.body = dataset.fusedSeries;
	ctx.status = 200;
	return ctx;
}

/**
 * get fusedserie by id
 */
async function getFusedserieById(ctx) {
	const {fusedSeries} = await DatasetModel.findById(ctx.params.datasetId);
	const fs = await fusedSeries.id(ctx.params.id);
	ctx.body = fs;
	ctx.status = 200;
	return ctx;
}

/**
 * create a new fusedserie
 */
async function createFusedserie(ctx) {
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
	const dataset = await DatasetModel.findById(ctx.params.datasetId);
	const {fusedSeries} = dataset;
	const updateFS = await fusedSeries.id(ctx.params.id);
	await updateFS.set(ctx.request.body);
	await dataset.save();
	ctx.body = {message: `updated fusedseries with id: ${ctx.params.id}`};
	ctx.status = 200;
	return ctx;
}

/**
 * delete all fusedseries
 */
async function deleteFusedseries(ctx) {
	const dataset = await DatasetModel.findById(ctx.params.datasetId);
	await dataset.set({fusedSeries: []});
	await dataset.save();
	ctx.body = {message: 'deleted all fusedseries'};
	ctx.status = 200;
	return ctx;
}

/**
 * delete a specific fusedserie
 */
async function deleteFusedserieById(ctx) {
	const dataset = await DatasetModel.findById(ctx.params.datasetId);
	await dataset.fusedSeries.id(ctx.params.id).remove();
	await dataset.save();
	ctx.body = {message: `deleted fusedseries with id: ${ctx.params.id}`};
	ctx.status = 200;
	return ctx;
}

module.exports = {
	getFusedseries,
	getFusedserieById,
	createFusedserie,
	updateFusedserieById,
	deleteFusedseries,
	deleteFusedserieById
};
