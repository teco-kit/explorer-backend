const Model = require('../models/user').model;

/**
 * get all users
 */
async function getUsers(ctx) {
	const {authId} = ctx.state;
	ctx.body = await Model.findOne({authId});
	ctx.status = 200;
}

/**
 * update own user
 */
async function updateUser(ctx) {
	const {authId} = ctx.state;
	ctx.body = await Model.findOneAndUpdate({authId}, {$set: ctx.request.body});
	ctx.status = 200;
}

module.exports = {
	getUsers,
	updateUser
};
