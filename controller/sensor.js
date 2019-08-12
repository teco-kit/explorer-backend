// get model
const Model = require('../models/sensor').model;

/**
 * get all sensors
 */
async function getSensors(ctx) {
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
		ctx.body = {error: `no sensors found`};
		ctx.status = 404;
		return ctx;
	}
}

/**
 * get sensor by id
 */
async function getSensorById(ctx) {
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
		ctx.body = {error: `sensor with id '${ctx.params.id}' not found`};
		ctx.status = 404;
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
 * update a bulk of sensors
 */
async function updateSensors(ctx) {
	// TODO: wie spezifizieren?
	ctx.body = {error: 'Not Implemented'};
	ctx.status = 501;
	return ctx;
}

/**
 * update a sensor specified by id
 */
async function updateSensorById(ctx) {
	try {
		await Model.findByIdAndUpdate(ctx.params.id, {$set: ctx.request.body});
		ctx.body = {message: `updated sensor with id: ${ctx.params.id}`};
		ctx.status = 200;
		return ctx;
	} catch (error) {
		ctx.body = {error: `sensor with id '${ctx.params.id}' not found`};
		ctx.status = 404;
		return ctx;
	}
}

/**
 * delete all sensors
 */
async function deleteSensors(ctx) {
	try {
		await Model.deleteMany({});
		ctx.body = {message: 'deleted all sensors'};
		ctx.status = 200;
		return ctx;
	} catch (error) {
		ctx.body = {error: error.message};
		ctx.status = 500;
		return ctx;
	}
}

/**
 * delete a sensor specified by id
 */
async function deleteSensorById(ctx) {
	try {
		await Model.findByIdAndDelete(ctx.params.id);
		ctx.body = {message: `deleted sensor with id: ${ctx.params.id}`};
		ctx.status = 200;
		return ctx;
	} catch (error) {
		ctx.body = {error: `sensor with id '${ctx.params.id}' not found`};
		ctx.status = 404;
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
