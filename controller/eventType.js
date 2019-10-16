const Model = require('../models/eventType').model;

/**
 * get all eventTypes
 */
async function getEventTypes(ctx) {
	ctx.body = await Model.find({});
	ctx.status = 200;
	return ctx;
}

/**
 * get eventType by id
 */
async function getEventTypeById(ctx) {
	ctx.body = await Model.findById(ctx.params.id);
	ctx.status = 200;
	return ctx;
}

/**
 * create a new eventType
 */
async function createEventType(ctx) {
	const document = new Model(ctx.request.body);
	await document.save();

	ctx.body = document;
	ctx.status = 201;
	return ctx;
}

/**
 * update a eventType specified by id
 */
async function updateEventTypeById(ctx) {
	await Model.findByIdAndUpdate(ctx.params.id, {$set: ctx.request.body});
	ctx.body = {message: `updated eventType with id: ${ctx.params.id}`};
	ctx.status = 200;
	return ctx;
}

/**
 * delete all eventTypes
 */
async function deleteEventTypes(ctx) {
	await Model.deleteMany({});
	ctx.body = {message: 'deleted all eventTypes'};
	ctx.status = 200;
	return ctx;
}

/**
 * delete a eventType specified by id
 */
async function deleteEventTypeById(ctx) {
	await Model.findOneAndDelete(ctx.params.id);
	ctx.body = {message: `deleted eventType with id: ${ctx.params.id}`};
	ctx.status = 200;
	return ctx;
}

module.exports = {
	getEventTypes,
	getEventTypeById,
	createEventType,
	updateEventTypeById,
	deleteEventTypes,
	deleteEventTypeById
};
