const Model = require('../models/labelTypeType').model;

/**
 * get all labelTypes
 */
async function getlabelTypes(ctx) {
	ctx.body = await Model.find({});
	ctx.status = 200;
	return ctx;
}

/**
 * get labelType by id
 */
async function getLabelTypeById(ctx) {
	ctx.body = await Model.findById(ctx.params.id);
	ctx.status = 200;
	return ctx;
}

/**
 * create a new labelType
 */
async function createLabelType(ctx) {
	const document = new Model(ctx.request.body);
	await document.save();

	ctx.body = document;
	ctx.status = 201;
	return ctx;
}

/**
 * update a labelType specified by id
 */
async function updateLabelTypeById(ctx) {
	await Model.findByIdAndUpdate(ctx.params.id, {$set: ctx.request.body});
	ctx.body = {message: `updated labelTypeType with id: ${ctx.params.id}`};
	ctx.status = 200;
	return ctx;
}

/**
 * delete all labelTypes
 */
async function deletelabelTypes(ctx) {
	await Model.deleteMany({});
	ctx.body = {message: 'deleted all labelTypeTypes'};
	ctx.status = 200;
	return ctx;
}

/**
 * delete a labelType specified by id
 */
async function deleteLabelTypeById(ctx) {
	await Model.findOneAndDelete(ctx.params.id);
	ctx.body = {message: `deleted labelType with id: ${ctx.params.id}`};
	ctx.status = 200;
	return ctx;
}

module.exports = {
	getlabelTypes,
	getLabelTypeById,
	createLabelType,
	updateLabelTypeById,
	deletelabelTypes,
	deleteLabelTypeById
};
