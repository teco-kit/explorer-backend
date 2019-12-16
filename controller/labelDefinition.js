const Model = require('../models/labelDefinition').model;

/**
 * get all labelDefinitions
 */
async function getLabelDefinitions(ctx) {
	ctx.body = await Model.find({});
	ctx.status = 200;
	return ctx;
}

/**
 * get labelDefinition by id
 */
async function getLabelDefinitionById(ctx) {
	ctx.body = await Model.findById(ctx.params.id);
	ctx.status = 200;
	return ctx;
}

/**
 * create a new labelDefinition
 */
async function createLabelDefinition(ctx) {
	const document = new Model(ctx.request.body);
	await document.save();

	ctx.body = document;
	ctx.status = 201;
	return ctx;
}

/**
 * update a labelDefinition specified by id
 */
async function updateLabelDefinitionById(ctx) {
	await Model.findByIdAndUpdate(ctx.params.id, {$set: ctx.request.body});
	ctx.body = {message: `updated labelDefinition with id: ${ctx.params.id}`};
	ctx.status = 200;
	return ctx;
}

/**
 * delete all labelDefinitions
 */
async function deleteLabelDefinitions(ctx) {
	await Model.deleteMany({});
	ctx.body = {message: 'deleted all labelDefinitions'};
	ctx.status = 200;
	return ctx;
}

/**
 * delete a labelDefinition specified by id
 */
async function deleteLabelDefinitionById(ctx) {
	await Model.findOneAndDelete({_id: ctx.params.id});
	ctx.body = {message: `deleted labelDefinition with id: ${ctx.params.id}`};
	ctx.status = 200;
	return ctx;
}

module.exports = {
	getLabelDefinitions,
	getLabelDefinitionById,
	createLabelDefinition,
	updateLabelDefinitionById,
	deleteLabelDefinitions,
	deleteLabelDefinitionById
};
