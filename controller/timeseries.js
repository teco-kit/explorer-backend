// get model
const DatasetModel = require('../models/dataset').model;
const TimeseriesModel = require('../models/timeSeries').model;

/**
 * get all timeseries
 */
async function getTimeseries(ctx) {
	const dataset = await DatasetModel.findById(ctx.params.datasetId);
	ctx.body = dataset.timeSeries;
	ctx.status = 200;
	return ctx;
}

/**
 * get timeserie by id
 */
async function getTimeserieById(ctx) {
	const {timeSeries} = await DatasetModel.findById(ctx.params.datasetId);
	ctx.body = await timeSeries.id(ctx.params.id);
	ctx.status = 200;
	return ctx;
}

/**
 * create a new timeserie
 */
async function createTimeserie(ctx) {
	const dataset = await DatasetModel.findById(ctx.params.datasetId);
	const timeserie = new TimeseriesModel(ctx.request.body);
	await dataset.timeSeries.push(timeserie);
	await dataset.save();
	ctx.body = timeserie;
	ctx.status = 201;
	return ctx;
}

/**
 * update a specific timeserie
 */
async function updateTimeserieById(ctx) {
	const dataset = await DatasetModel.findById(ctx.params.datasetId);
	const {timeSeries} = dataset;
	const updateTS = await timeSeries.id(ctx.params.id);
	await updateTS.set(ctx.request.body);
	await dataset.save();
	ctx.body = {message: `updated timeseries with id: ${ctx.params.id}`};
	ctx.status = 200;
	return ctx;
}

/**
 * delete all timeseries
 */
async function deleteTimeseries(ctx) {
	const dataset = await DatasetModel.findById(ctx.params.datasetId);
	await dataset.set({timeSeries: []});
	await dataset.save();
	ctx.body = {message: 'deleted all timeseries'};
	ctx.status = 200;
	return ctx;
}

/**
 * delete a specific timeserie
 */
async function deleteTimeserieById(ctx) {
	const dataset = await DatasetModel.findById(ctx.params.datasetId);
	await dataset.timeSeries.id(ctx.params.id).remove();
	await dataset.save();
	ctx.body = {message: `deleted timeSeries with id: ${ctx.params.id}`};
	ctx.status = 200;
	return ctx;
}

module.exports = {
	getTimeseries,
	getTimeserieById,
	createTimeserie,
	updateTimeserieById,
	deleteTimeseries,
	deleteTimeserieById
};
