// get model
const DatasetModel = require('../models/dataset').model;
const EventModel = require('../models/datasetEvent').model;

/**
 * get all events
 */
async function getEvents(ctx) {
	try {
		const dataset = await DatasetModel.findById(ctx.params.datasetId);
		ctx.body = dataset.events;
		ctx.status = 200;
		return ctx;
	} catch (error) {
		ctx.body = {error: error.message};
		ctx.status = 500;
		return ctx;
	}
}

/**
 * get event by id
 */
async function getEventById(ctx) {
	try {
		const {events} = await DatasetModel.findById(ctx.params.datasetId);
		const event = await events.id(ctx.params.id);
		ctx.body = event;
		ctx.status = 200;
		return ctx;
	} catch (error) {
		ctx.body = {error: error.message};
		ctx.status = 500;
		return ctx;
	}
}

/**
 * create a new event
 */
async function createEvent(ctx) {
	try {
		const dataset = await DatasetModel.findById(ctx.params.datasetId);
		const event = new EventModel(ctx.request.body);
		// TODO: validate time by hand
		// -> cannot access parent here since no parent defined yet
		await dataset.events.push(event);
		await dataset.save();
		ctx.body = event;
		ctx.status = 201;
		return ctx;
	} catch (error) {
		ctx.body = {error: error.message};
		ctx.status = 500;
		return ctx;
	}
}

/**
 * update a bulk of events
 */
async function updateEvents(ctx) {
	// TODO: wie spezifizieren?
	ctx.body = {error: 'Not Implemented'};
	ctx.status = 501;
	return ctx;
}

/**
 * update a specific event
 */
async function updateEventById(ctx) {
	try {
		const dataset = await DatasetModel.findById(ctx.params.datasetId);
		const {events} = dataset;
		const updateEvent = await events.id(ctx.params.id);
		await updateEvent.set(ctx.request.body);
		await dataset.save();
		ctx.body = {message: `updated event type with id: ${ctx.params.id}`};
		ctx.status = 200;
		return ctx;
	} catch (error) {
		ctx.body = {error: error.message};
		ctx.status = 500;
		return ctx;
	}
}

/**
 * delete all events
 */
async function deleteEvents(ctx) {
	try {
		const dataset = await DatasetModel.findById(ctx.params.datasetId);
		await dataset.set({events: []});
		await dataset.save();
		ctx.body = {message: 'deleted all events'};
		ctx.status = 200;
		return ctx;
	} catch (error) {
		ctx.body = {error: error.message};
		ctx.status = 500;
		return ctx;
	}
}

/**
 * delete a specific event
 */
async function deleteEventById(ctx) {
	try {
		const dataset = await DatasetModel.findById(ctx.params.datasetId);
		await dataset.events.id(ctx.params.id).remove();
		await dataset.save();
		ctx.body = {message: `deleted event type with id: ${ctx.params.id}`};
		ctx.status = 200;
		return ctx;
	} catch (error) {
		ctx.body = {error: error.message};
		ctx.status = 500;
		return ctx;
	}
}

module.exports = {
	getEvents,
	getEventById,
	createEvent,
	updateEvents,
	updateEventById,
	deleteEvents,
	deleteEventById
};
