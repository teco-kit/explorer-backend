const DatasetModel = require("../models/dataset").model;
const Model = require("../models/datasetEvent").model;
const ProjectModel = require("../models/project").model;

async function checkAccess(ctx) {
	const project = await ProjectModel.findOne({
		_id: ctx.header.project,
		datasets: ctx.params.datasetId,
	});
	if (!project) {
		ctx.body = { error: "Access denied" };
		ctx.status = 403;
		return false;
	}
	return true;
}

/**
 * get all events
 */
async function getEvents(ctx) {
	if (!(await checkAccess(ctx))) {
		return ctx;
	}
	const dataset = await DatasetModel.findById(ctx.params.datasetId);
	ctx.body = dataset.events;
	ctx.status = 200;
	return ctx;
}

/**
 * get event by id
 */
async function getEventById(ctx) {
	if (!(await checkAccess(ctx))) {
		return ctx;
	}
	const { events } = await DatasetModel.findById(ctx.params.datasetId);
	ctx.body = await events.id(ctx.params.id);
	ctx.status = 200;
	return ctx;
}

/**
 * create a new event
 */
async function createEvent(ctx) {
	if (!(await checkAccess(ctx))) {
		return ctx;
	}
	const dataset = await DatasetModel.findById(ctx.params.datasetId);
	const event = new Model(ctx.request.body);
	await dataset.events.push(event);
	await dataset.save();
	ctx.body = event;
	ctx.status = 201;
	return ctx;
}

/**
 * update a specific event
 */
async function updateEventById(ctx) {
	if (!(await checkAccess(ctx))) {
		return ctx;
	}
	const dataset = await DatasetModel.findById(ctx.params.datasetId);
	const { events } = dataset;
	const updateEvent = await events.id(ctx.params.id);
	await updateEvent.set(ctx.request.body);
	await dataset.save();
	ctx.body = { message: `updated event with id: ${ctx.params.id}` };
	ctx.status = 200;
	return ctx;
}

/**
 * delete all events
 */
async function deleteEvents(ctx) {
	if (!(await checkAccess(ctx))) {
		return ctx;
	}
	const dataset = await DatasetModel.findById(ctx.params.datasetId);
	await dataset.set({ events: [] });
	await dataset.save();
	ctx.body = { message: "deleted all events" };
	ctx.status = 200;
	return ctx;
}

/**
 * delete a specific event
 */
async function deleteEventById(ctx) {
	if (!(await checkAccess(ctx))) {
		return ctx;
	}
	const dataset = await DatasetModel.findById(ctx.params.datasetId);
	await dataset.events.id(ctx.params.id).remove();
	await dataset.save();
	ctx.body = { message: `deleted event with id: ${ctx.params.id}` };
	ctx.status = 200;
	return ctx;
}

module.exports = {
	getEvents,
	getEventById,
	createEvent,
	updateEventById,
	deleteEvents,
	deleteEventById,
};
