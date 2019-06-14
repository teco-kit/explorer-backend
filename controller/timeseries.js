// get model
const DatasetModel = require('../models/dataset').model;
const TimeseriesModel = require('../models/timeSeries').model;

/**
 * get all timeseries
 */
async function getTimeseries(ctx) {
	try {
		const dataset = await DatasetModel.findById(ctx.params.datasetId);
		ctx.body = {data: dataset.timeSeries};
		ctx.status = 201;
		return ctx;
	} catch (error) {
		ctx.body = {error: error.message};
		ctx.status = 500;
		return ctx;
	}
}

/**
 * get timeserie by id
 */
async function getTimeserieById(ctx) {
	try {
		const {timeSeries} = await DatasetModel.findById(ctx.params.datasetId);
		const timeserie = await timeSeries.id(ctx.params.id);
		ctx.body = {data: timeserie};
		ctx.status = 201;
		return ctx;
	} catch (error) {
		ctx.body = {error: error.message};
		ctx.status = 500;
		return ctx;
	}
}

/**
 * create a new timeserie
 */
async function createTimeserie(ctx) {
	try {
		const dataset = await DatasetModel.findById(ctx.params.datasetId);
		const timeserie = new TimeseriesModel(ctx.request.body);
		await dataset.timeSeries.push(timeserie);
		await dataset.save();
		ctx.body = {data: timeserie};
		ctx.status = 201;
		return ctx;
	} catch (error) {
		ctx.body = {error: error.message};
		ctx.status = 500;
		return ctx;
	}
}

/**
 * update a bulk of timeseries
 */
async function updateTimeseries(ctx) {
	// TODO: wie spezifizieren?
	ctx.body = {error: 'Not Implemented'};
	ctx.status = 501;
	return ctx;}

/**
 * update a specific timeserie
 */
async function updateTimeserieById(ctx) {
	try {
		const dataset = await DatasetModel.findById(ctx.params.datasetId);
		const {timeSeries} = dataset;
		const updateTS = await timeSeries.id(ctx.params.id);
		await updateTS.set(ctx.request.body);
		await dataset.save();
		ctx.body = {message: `updated timeseries with id: ${ctx.params.id}`};
		ctx.status = 201;
		return ctx;
	} catch (error) {
		ctx.body = {error: error.message};
		ctx.status = 500;
		return ctx;
	}
}

/**
 * delete all timeseries
 */
async function deleteTimeseries(ctx) {
	try {
		const dataset = await DatasetModel.findById(ctx.params.datasetId);
		await dataset.set({timeSeries: []});
		await dataset.save();
		ctx.body = {message: 'deleted all timeseries'};
		ctx.status = 201;
		return ctx;
	} catch (error) {
		ctx.body = {error: error.message};
		ctx.status = 500;
		return ctx;
	}
}

/**
 * delete a specific timeserie
 */
async function deleteTimeserieById(ctx) {
	try {
		const dataset = await DatasetModel.findById(ctx.params.datasetId);
		await dataset.timeSeries.id(ctx.params.id).remove();
		await dataset.save();
		ctx.body = {message: `deleted timeSeries with id: ${ctx.params.id}`};
		ctx.status = 201;
		return ctx;
	} catch (error) {
		ctx.body = {error: error.message};
		ctx.status = 500;
		return ctx;
	}
}

module.exports = {
	getTimeseries,
	getTimeserieById,
	createTimeserie,
	updateTimeseries,
	updateTimeserieById,
	deleteTimeseries,
	deleteTimeserieById
};
