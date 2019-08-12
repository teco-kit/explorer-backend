// get model
const Model = require('../models/event').model;

/**
 * get all events
 */
async function getEvents(ctx) {
	try {
		const result = await Model.find({});
		if(!result.length) {
			throw new Error();
		} else {
			ctx.body = result;
			ctx.status = 200;
		}
		return ctx;
	} catch (error) {
		ctx.body = {error: `no events found`};
		ctx.status = 404;
		return ctx;
	}
}

/**
 * get event by id
 */
async function getEventById(ctx) {
	try {
		const result = await Model.findById(ctx.params.id);
		if(!result) {
			throw new Error();
		} else {
			ctx.body = result;
			ctx.status = 200;
			return ctx.body;
		}
	} catch (error) {
		ctx.body = {error: `event with id '${ctx.params.id}' not found`};
		ctx.status = 404;
		return ctx;
	}
}

/**
 * create a new event
 */
async function createEvent(ctx) {
	try {
		const document = new Model(ctx.request.body);
		const result = await document.save();
		ctx.body = result;
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
 * update a event specified by id
 */
async function updateEventById(ctx) {
	try {
		await Model.findByIdAndUpdate(ctx.params.id, {$set: ctx.request.body});
		ctx.body = {message: `updated event with id: ${ctx.params.id}`};
		ctx.status = 200;
		return ctx;
	} catch (error) {
		ctx.body = {error: `event with id '${ctx.params.id}' not found`};
		ctx.status = 404;
		return ctx;
	}
}

/**
 * delete all events
 */
async function deleteEvents(ctx) {
	try {
		await Model.deleteMany({});
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
 * delete a event specified by id
 */
async function deleteEventById(ctx) {
	try {
		await Model.findByIdAndDelete(ctx.params.id);
		ctx.body = {message: `deleted event with id: ${ctx.params.id}`};
		ctx.status = 200;
		return ctx;
	} catch (error) {
		ctx.body = {error: `event with id '${ctx.params.id}' not found`};
		ctx.status = 404;
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
