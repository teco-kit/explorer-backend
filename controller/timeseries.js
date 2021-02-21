// get model
const DatasetModel = require('../models/dataset').model;
const TimeseriesModel = require('../models/timeSeries').model;
const ProjectModel = require('../models/project').model;


async function checkAccess(ctx) {
	const project = await ProjectModel.findOne({ _id: ctx.header.project, datasets: ctx.params.datasetId });
	if (!project) {
		ctx.body = { error: 'Access denied' };
		ctx.status = 403;
		return false;
	}
	return true;
}

/**
 * get all timeseries
 */
async function getTimeseries(ctx) {
	if (!await checkAccess(ctx)) {
		return ctx;
	}
	const dataset = await DatasetModel.findById(ctx.params.datasetId);
	ctx.body = dataset.timeSeries;
	ctx.status = 200;
	return ctx;
}

/**
 * get timeserie by id
 */
async function getTimeserieById(ctx) {
	if (!await checkAccess(ctx)) {
		return ctx;
	}
	const { timeSeries } = await DatasetModel.findById(ctx.params.datasetId);
	ctx.body = await timeSeries.id(ctx.params.id);
	ctx.status = 200;
	return ctx;
}

/**
 * create a new timeserie
 */
async function createTimeserie(ctx) {
	if (!await checkAccess(ctx)) {
		return ctx;
	}
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
	if (!await checkAccess(ctx)) {
		return ctx;
	}
	const dataset = await DatasetModel.findById(ctx.params.datasetId);
	const { timeSeries } = dataset;
	const updateTS = await timeSeries.id(ctx.params.id);
	await updateTS.set(ctx.request.body);
	await dataset.save();
	ctx.body = { message: `updated timeseries with id: ${ctx.params.id}` };
	ctx.status = 200;
	return ctx;
}

/**
 * delete all timeseries
 */
async function deleteTimeseries(ctx) {
	if (!await checkAccess(ctx)) {
		return ctx;
	}
	const dataset = await DatasetModel.findById(ctx.params.datasetId);
	await dataset.set({ timeSeries: [] });
	await dataset.save();
	ctx.body = { message: 'deleted all timeseries' };
	ctx.status = 200;
	return ctx;
}

/**
 * delete a specific timeserie
 */
async function deleteTimeserieById(ctx) {
	if (!await checkAccess(ctx)) {
		return ctx;
	}
	const dataset = await DatasetModel.findById(ctx.params.datasetId);
	await dataset.timeSeries.id(ctx.params.id).remove();
	await dataset.save();
	ctx.body = { message: `deleted timeseries with id: ${ctx.params.id}` };
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
