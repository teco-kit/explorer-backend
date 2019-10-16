const Model = require('../models/firmware').model;

/**
 * get all firmware
 */
async function getFirmware(ctx) {
	ctx.body = await Model.find({});
	ctx.status = 200;
	return ctx;
}

/**
 * get firmware by id
 */
async function getFirmwareById(ctx) {
	ctx.body = await Model.findById(ctx.params.id);
	ctx.status = 200;
	return ctx;
}

/**
 * create a new firmware
 */
async function createFirmware(ctx) {
	const document = new Model(ctx.request.body);
	await document.save();

	ctx.body = document;
	ctx.status = 201;
	return ctx;
}

/**
 * update a firmware specified by id
 */
async function updateFirmwareById(ctx) {
	await Model.findByIdAndUpdate(ctx.params.id, {$set: ctx.request.body});
	ctx.body = {message: `updated firmware with id: ${ctx.params.id}`};
	ctx.status = 200;
	return ctx;
}

/**
 * delete all firmware
 */
async function deleteFirmware(ctx) {
	await Model.deleteMany({});
	ctx.body = {message: 'deleted all firmware'};
	ctx.status = 200;
	return ctx;
}

/**
 * delete a firmware specified by id
 */
async function deleteFirmwareById(ctx) {
	await Model.findOneAndDelete(ctx.params.id);
	ctx.body = {message: `deleted firmware with id: ${ctx.params.id}`};
	ctx.status = 200;
	return ctx;
}

module.exports = {
	getFirmware,
	getFirmwareById,
	createFirmware,
	updateFirmwareById,
	deleteFirmware,
	deleteFirmwareById
};
