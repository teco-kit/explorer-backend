// get model
const Model = require('../models/user').model;

/**
 * get all users
 */
async function getUsers(ctx) {
	try {
		const result = await Model.find({});
		ctx.body = {data: result};
		ctx.status = 200;
		return ctx;
	} catch (error) {
		ctx.body = {error: error.message};
		ctx.status = 500;
		return ctx;
	}
}

/**
 * get user by id
 */
async function getUserById(ctx) {
	try {
		const result = await Model.findById(ctx.params.id);
		ctx.body = {data: result};
		ctx.status = 200;
		return ctx;
	} catch (error) {
		ctx.body = {error: error.message};
		ctx.status = 500;
		return ctx;
	}
}

/**
 * create a new user
 */
async function createUser(ctx) {
	try {
		const document = new Model(ctx.request.body);
		const result = await document.save();
		ctx.body = {data: result};
		ctx.status = 200;
		return ctx;
	} catch (error) {
		ctx.body = {error: error.message};
		ctx.status = 500;
		return ctx;
	}
}

/**
 * update a bulk of users
 */
async function updateUsers(ctx) {
	// TODO: wie spezifizieren?
	ctx.body = {error: 'Not Implemented'};
	ctx.status = 501;
	return ctx;
}

/**
 * update a user specified by id
 */
async function updateUserById(ctx) {
	try {
		await Model.findByIdAndUpdate(ctx.params.id, {$set: ctx.request.body});
		ctx.body = {message: `updated user with id: ${ctx.params.id}`};
		ctx.status = 200;
		return ctx;
	} catch (error) {
		ctx.body = {error: error.message};
		ctx.status = 500;
		return ctx;
	}
}

/**
 * delete all users
 */
async function deleteUsers(ctx) {
	try {
		await Model.deleteMany({});
		ctx.body = {message: 'deleted all users'};
		ctx.status = 200;
		return ctx;
	} catch (error) {
		ctx.body = {error: error.message};
		ctx.status = 500;
		return ctx;
	}
}

/**
 * delete a user specified by id
 */
async function deleteUserById(ctx) {
	try {
		await Model.findByIdAndDelete(ctx.params.id);
		ctx.body = {message: `deleted user with id: ${ctx.params.id}`};
		ctx.status = 200;
		return ctx;
	} catch (error) {
		ctx.body = {error: error.message};
		ctx.status = 500;
		return ctx;
	}
}

module.exports = {
	getUsers,
	getUserById,
	createUser,
	updateUsers,
	updateUserById,
	deleteUsers,
	deleteUserById
};
