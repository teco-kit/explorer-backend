const Model = require('../models/dataset').model;
const UserModel = require('../models/user').model;

/**
 * get all datasets
 */
async function getDatasets(ctx) {
	const {authId} = ctx.state;
	const user = await UserModel.findOne({authId});
	ctx.body = await Model.find({userId: user._id});
	ctx.status = 200;
}

/**
 * get dataset by id
 */
async function getDatasetById(ctx) {
	const {authId} = ctx.state;
	const user = await UserModel.findOne({authId});
	ctx.body = await Model.findById({_id: ctx.params.id, userId: user._id});
	ctx.status = 200;
	return ctx.body;
}

/**
 * create a new dataset
 */
async function createDataset(ctx) {
	const dataset = ctx.request.body;

	// if userId empty, set it to requesting user
	if(!dataset.userId) {
		const {authId} = ctx.state;
		const user = await UserModel.findOne({authId});
		dataset.userId = user._id;
	}

	const document = new Model(dataset);
	await document.save();

	ctx.body = document;
	ctx.status = 201;
	return ctx;
}

/**
 * update a dataset specified by id
 */
async function updateDatasetById(ctx) {
	await Model.findByIdAndUpdate(ctx.params.id, {$set: ctx.request.body});
	ctx.body = {message: `updated dataset with id: ${ctx.params.id}`};
	ctx.status = 200;
	return ctx;
}

/**
 * delete a dataset specified by id
 */
async function deleteDatasetById(ctx) {
	const {authId} = ctx.state;
	const user = await UserModel.findOne({authId});
	await Model.findOneAndDelete({_id: ctx.params.id, userId: user._id});
	ctx.body = {message: `deleted dataset with id: ${ctx.params.id}`};
	ctx.status = 200;
	return ctx;
}

module.exports = {
	getDatasets,
	getDatasetById,
	createDataset,
	updateDatasetById,
	deleteDatasetById
};
