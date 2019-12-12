const Model = require('../models/instructions').model;

/**
 * get all instructions
 */
async function getInstructions(ctx) {
	ctx.body = await Model.find({});
	ctx.status = 200;
	return ctx;
}

/**
 * get instruction by id
 */
async function getInstructionById(ctx) {
	ctx.body = await Model.findById(ctx.params.id);
	ctx.status = 200;
	return ctx;
}

/**
 * create a new instruction
 */
async function createInstruction(ctx) {
	const document = new Model(ctx.request.body);
	await document.save();

	ctx.body = document;
	ctx.status = 201;
	return ctx;
}

/**
 * update a instruction specified by id
 */
async function updateInstructionById(ctx) {
	await Model.findByIdAndUpdate(ctx.params.id, {$set: ctx.request.body});
	ctx.body = {message: `updated instruction with id: ${ctx.params.id}`};
	ctx.status = 200;
	return ctx;
}

/**
 * delete all instructions
 */
async function deleteInstructions(ctx) {
	await Model.deleteMany({});
	ctx.body = {message: 'deleted all instructions'};
	ctx.status = 200;
	return ctx;
}

/**
 * delete a instruction specified by id
 */
async function deleteInstructionById(ctx) {
	await Model.findOneAndDelete(ctx.params.id);
	ctx.body = {message: `deleted instruction with id: ${ctx.params.id}`};
	ctx.status = 200;
	return ctx;
}

module.exports = {
	getInstructions,
	getInstructionById,
	createInstruction,
	updateInstructionById,
	deleteInstructions,
	deleteInstructionById
};
