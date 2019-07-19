// get model
const Model = require('../models/service').model;

/**
 * get all services
 */
async function getServices(ctx) {
	try {
		const result = await Model.find({});
		if(!result.length) {
			throw new Error();
		} else {
			ctx.body = {data: result};
			ctx.status = 200;
		}
		return ctx;
	} catch (error) {
		ctx.body = {error: `no services found`};
		ctx.status = 404;
		return ctx;
	}
}

/**
 * get service by id
 */
async function getServiceById(ctx) {
	try {
		const result = await Model.findById(ctx.params.id);
		if(!result) {
			throw new Error();
		} else {
			ctx.body = {data: result};
			ctx.status = 200;
			return ctx.body;
		}
	} catch (error) {
		ctx.body = {error: `service with id '${ctx.params.id}' not found`};
		ctx.status = 404;
		return ctx;
	}
}

/**
 * create a new service
 */
async function createService(ctx) {
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
 * update a bulk of services
 */
async function updateServices(ctx) {
	// TODO: wie spezifizieren?
	ctx.body = {error: 'Not Implemented'};
	ctx.status = 501;
	return ctx;
}

/**
 * update a service specified by id
 */
async function updateServiceById(ctx) {
	try {
		await Model.findByIdAndUpdate(ctx.params.id, {$set: ctx.request.body});
		ctx.body = {message: `updated service with id: ${ctx.params.id}`};
		ctx.status = 200;
		return ctx;
	} catch (error) {
		ctx.body = {error: `service with id '${ctx.params.id}' not found`};
		ctx.status = 404;
		return ctx;
	}
}

/**
 * delete all services
 */
async function deleteServices(ctx) {
	try {
		await Model.deleteMany({});
		ctx.body = {message: 'deleted all services'};
		ctx.status = 200;
		return ctx;
	} catch (error) {
		ctx.body = {error: error.message};
		ctx.status = 500;
		return ctx;
	}
}

/**
 * delete a service specified by id
 */
async function deleteServiceById(ctx) {
	try {
		await Model.findByIdAndDelete(ctx.params.id);
		ctx.body = {message: `deleted service with id: ${ctx.params.id}`};
		ctx.status = 200;
		return ctx;
	} catch (error) {
		ctx.body = {error: `service with id '${ctx.params.id}' not found`};
		ctx.status = 404;
		return ctx;
	}
}

module.exports = {
	getServices,
	getServiceById,
	createService,
	updateServices,
	updateServiceById,
	deleteServices,
	deleteServiceById
};
