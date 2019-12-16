const Model = require('../models/device').model;

/**
 * get all devices
 */
async function getDevices(ctx) {
	ctx.body = await Model.find({});
	ctx.status = 200;
	return ctx;
}

/**
 * get device by id
 */
async function getDeviceById(ctx) {
	ctx.body = await Model.findById(ctx.params.id);
	ctx.status = 200;
	return ctx;
}

/**
 * create a new device
 */
async function createDevice(ctx) {
	const document = new Model(ctx.request.body);
	await document.save();

	ctx.body = document;
	ctx.status = 201;
	return ctx;
}

/**
 * update a device specified by id
 */
async function updateDeviceById(ctx) {
	await Model.findByIdAndUpdate(ctx.params.id, {$set: ctx.request.body});
	ctx.body = {message: `updated device with id: ${ctx.params.id}`};
	ctx.status = 200;
	return ctx;
}

/**
 * delete all devices
 */
async function deleteDevices(ctx) {
	await Model.deleteMany({});
	ctx.body = {message: 'deleted all devices'};
	ctx.status = 200;
	return ctx;
}

/**
 * delete a device specified by id
 */
async function deleteDeviceById(ctx) {
	await Model.findOneAndDelete({_id: ctx.params.id});
	ctx.body = {message: `deleted device with id: ${ctx.params.id}`};
	ctx.status = 200;
	return ctx;
}

module.exports = {
	getDevices,
	getDeviceById,
	createDevice,
	updateDeviceById,
	deleteDevices,
	deleteDeviceById
};
