const Model = require('../models/sensor').model;

/**
 * get all sensors
 */
async function getSensors(ctx) {
	ctx.body = await Model.find({});
	ctx.status = 200;
	return ctx;
}

/**
 * get sensor by id
 */
async function getSensorById(ctx) {
	ctx.body = await Model.findById(ctx.params.id);
	ctx.status = 200;
	return ctx;
}

/**
 * create a new sensor
 */
async function createSensor(ctx) {
	const document = new Model(ctx.request.body);
	await document.save();

	ctx.body = document;
	ctx.status = 201;
	return ctx;
}

/**
 * update a sensor specified by id
 */
async function updateSensorById(ctx) {
	await Model.findByIdAndUpdate(ctx.params.id, {$set: ctx.request.body});
	ctx.body = {message: `updated sensor with id: ${ctx.params.id}`};
	ctx.status = 200;
	return ctx;
}

/**
 * delete all sensors
 */
async function deleteSensors(ctx) {
	await Model.deleteMany({});
	ctx.body = {message: 'deleted all sensors'};
	ctx.status = 200;
	return ctx;
}

/**
 * delete a sensor specified by id
 */
async function deleteSensorById(ctx) {
	await Model.findOneAndDelete({_id: ctx.params.id});
	ctx.body = {message: `deleted sensor with id: ${ctx.params.id}`};
	ctx.status = 200;
	return ctx;
}

module.exports = {
	getSensors,
	getSensorById,
	createSensor,
	updateSensorById,
	deleteSensors,
	deleteSensorById
};
