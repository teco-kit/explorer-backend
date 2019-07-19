// get model
const Model = require('../models/firmware').model;

/**
 * get all firmware
 */
async function getFirmware(ctx) {
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
		ctx.body = {error: `no firmware found`};
		ctx.status = 404;
		return ctx;
	}
}

/**
 * get firmware by id
 */
async function getFirmwareById(ctx) {
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
		ctx.body = {error: `firmware with id '${ctx.params.id}' not found`};
		ctx.status = 404;
		return ctx;
	}
}

/**
 * create a new firmware
 */
async function createFirmware(ctx) {
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
 * update a bulk of firmware
 */
async function updateFirmware(ctx) {
	// TODO: wie spezifizieren?
	ctx.body = {error: 'Not Implemented'};
	ctx.status = 501;
	return ctx;
}

/**
 * update a firmware specified by id
 */
async function updateFirmwareById(ctx) {
	try {
		await Model.findByIdAndUpdate(ctx.params.id, {$set: ctx.request.body});
		ctx.body = {message: `updated firmware with id: ${ctx.params.id}`};
		ctx.status = 200;
		return ctx;
	} catch (error) {
		ctx.body = {error: `firmware with id '${ctx.params.id}' not found`};
		ctx.status = 404;
		return ctx;
	}
}

/**
 * delete all firmware
 */
async function deleteFirmware(ctx) {
	try {
		await Model.deleteMany({});
		ctx.body = {message: 'deleted all firmware'};
		ctx.status = 200;
		return ctx;
	} catch (error) {
		ctx.body = {error: error.message};
		ctx.status = 500;
		return ctx;
	}
}

/**
 * delete a firmware specified by id
 */
async function deleteFirmwareById(ctx) {
	try {
		await Model.findByIdAndDelete(ctx.params.id);
		ctx.body = {message: `deleted firmware with id: ${ctx.params.id}`};
		ctx.status = 200;
		return ctx;
	} catch (error) {
		ctx.body = {error: `firmware with id '${ctx.params.id}' not found`};
		ctx.status = 404;
		return ctx;
	}
}

module.exports = {
	getFirmware,
	getFirmwareById,
	createFirmware,
	updateFirmware,
	updateFirmwareById,
	deleteFirmware,
	deleteFirmwareById
};
