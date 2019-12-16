const Model = require('../models/service').model;

/**
 * get all services
 */
async function getServices(ctx) {
	ctx.body = await Model.find({});
	ctx.status = 200;
	return ctx;
}

/**
 * get service by id
 */
async function getServiceById(ctx) {
	ctx.body = await Model.findById(ctx.params.id);
	ctx.status = 200;
	return ctx;
}

/**
 * create a new service
 */
async function createService(ctx) {
	const document = new Model(ctx.request.body);
	await document.save();

	ctx.body = document;
	ctx.status = 201;
	return ctx;
}

/**
 * update a service specified by id
 */
async function updateServiceById(ctx) {
	await Model.findByIdAndUpdate(ctx.params.id, {$set: ctx.request.body});
	ctx.body = {message: `updated service with id: ${ctx.params.id}`};
	ctx.status = 200;
	return ctx;
}

/**
 * delete all services
 */
async function deleteServices(ctx) {
	await Model.deleteMany({});
	ctx.body = {message: 'deleted all services'};
	ctx.status = 200;
	return ctx;
}

/**
 * delete a service specified by id
 */
async function deleteServiceById(ctx) {
	await Model.findOneAndDelete({_id: ctx.params.id});
	ctx.body = {message: `deleted service with id: ${ctx.params.id}`};
	ctx.status = 200;
	return ctx;
}

module.exports = {
	getServices,
	getServiceById,
	createService,
	updateServiceById,
	deleteServices,
	deleteServiceById
};
