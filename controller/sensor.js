// get model
const Model = require('../models/sensorType').model;

/**
 * get all sensors
 */
async function getSensors(ctx) {
	try {
		const result = await Model.find({});
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
 * get sensor by id
 */
async function getSensorById(ctx) {
	try {
		const result = await Model.findById(ctx.params.id);
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
 * create a new sensor
 */
async function createSensor(ctx) {
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
 * update a bulk of sensors
 */
async function updateSensors(ctx) {
	// TODO: wie spezifizieren?
	ctx.body = {error: 'Not Implemented'};
	ctx.status = 501;
	return ctx;}

/**
 * update a specific sensor
 */
async function updateSensorById(ctx) {
	try {
		await Model.findByIdAndUpdate(ctx.params.id, {$set: ctx.request.body});
		ctx.body = {message: `updated sensor type with id: ${ctx.params.id}`};
		ctx.status = 201;
		return ctx;
	} catch (error) {
		ctx.body = {error: error.message};
		ctx.status = 500;
		return ctx;
	}
}

/**
 * delete all sensors
 */
async function deleteSensors(ctx) {
	try {
		await Model.deleteMany({});
		ctx.body = {message: 'deleted all sensor types'};
		ctx.status = 201;
		return ctx;
	} catch (error) {
		ctx.body = {error: error.message};
		ctx.status = 500;
		return ctx;
	}}

/**
 * delete a specific sensor
 */
async function deleteSensorById(ctx) {
	try {
		await Model.findByIdAndDelete(ctx.params.id);
		ctx.body = {message: `deleted sensor type with id: ${ctx.params.id}`};
		ctx.status = 201;
		return ctx;
	} catch (error) {
		ctx.body = {error: error.message};
		ctx.status = 500;
		return ctx;
	}
}

module.exports = {
	getSensors,
	getSensorById,
	createSensor,
	updateSensors,
	updateSensorById,
	deleteSensors,
	deleteSensorById
};
