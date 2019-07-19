// get model
const Model = require('../models/device').model;

/**
 * get all devices
 */
async function getDevices(ctx) {
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
		ctx.body = {error: `no devices found`};
		ctx.status = 404;
		return ctx;
	}
}

/**
 * get device by id
 */
async function getDeviceById(ctx) {
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
		ctx.body = {error: `device with id '${ctx.params.id}' not found`};
		ctx.status = 404;
		return ctx;
	}
}

/**
 * create a new device
 */
async function createDevice(ctx) {
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
 * update a bulk of devices
 */
async function updateDevices(ctx) {
	// TODO: wie spezifizieren?
	ctx.body = {error: 'Not Implemented'};
	ctx.status = 501;
	return ctx;
}

/**
 * update a device specified by id
 */
async function updateDeviceById(ctx) {
	try {
		await Model.findByIdAndUpdate(ctx.params.id, {$set: ctx.request.body});
		ctx.body = {message: `updated device with id: ${ctx.params.id}`};
		ctx.status = 200;
		return ctx;
	} catch (error) {
		ctx.body = {error: `device with id '${ctx.params.id}' not found`};
		ctx.status = 404;
		return ctx;
	}
}

/**
 * delete all devices
 */
async function deleteDevices(ctx) {
	try {
		await Model.deleteMany({});
		ctx.body = {message: 'deleted all devices'};
		ctx.status = 200;
		return ctx;
	} catch (error) {
		ctx.body = {error: error.message};
		ctx.status = 500;
		return ctx;
	}
}

/**
 * delete a device specified by id
 */
async function deleteDeviceById(ctx) {
	try {
		await Model.findByIdAndDelete(ctx.params.id);
		ctx.body = {message: `deleted device with id: ${ctx.params.id}`};
		ctx.status = 200;
		return ctx;
	} catch (error) {
		ctx.body = {error: `device with id '${ctx.params.id}' not found`};
		ctx.status = 404;
		return ctx;
	}
}

module.exports = {
	getDevices,
	getDeviceById,
	createDevice,
	updateDevices,
	updateDeviceById,
	deleteDevices,
	deleteDeviceById
};
