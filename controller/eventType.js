// get model
const Model = require('../models/eventType').model;

/**
 * get all eventTypes
 */
async function getEventTypes(ctx) {
	try {
		const result = await Model.find({});
		ctx.body = {data: result};
		ctx.status = 200;
		return ctx;
	} catch (error) {
		ctx.body = {error: error.message};
		ctx.status = 500;
		return ctx;
	}
}

/**
 * get eventTypes by id
 */
async function getEventTypeById(ctx) {
	try {
		const result = await Model.findById(ctx.params.id);
		ctx.body = {data: result};
		ctx.status = 200;
		return ctx;
	} catch (error) {
		ctx.body = {error: error.message};
		ctx.status = 500;
		return ctx;
	}
}

/**
 * create a new eventType
 */
async function createEventType(ctx) {
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
 * update a bulk of eventType
 */
async function updateEventTypes(ctx) {
	// TODO: wie spezifizieren?
	ctx.body = {error: 'Not Implemented'};
	ctx.status = 501;
	return ctx;
}

/**
 * update a specific eventType
 */
async function updateEventTypeById(ctx) {
	try {
		await Model.findByIdAndUpdate(ctx.params.id, {$set: ctx.request.body});
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
 * delete all eventTypes
 */
async function deleteEventTypes(ctx) {
	try {
		await Model.deleteMany({});
		ctx.body = {message: 'deleted all event types'};
		ctx.status = 200;
		return ctx;
	} catch (error) {
		ctx.body = {error: error.message};
		ctx.status = 500;
		return ctx;
	}
}

/**
 * delete a specific eventType
 */
async function deleteEventTypeById(ctx) {
	try {
		await Model.findByIdAndDelete(ctx.params.id);
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
	getEventTypes,
	getEventTypeById,
	createEventType,
	updateEventTypes,
	updateEventTypeById,
	deleteEventTypes,
	deleteEventTypeById
};
