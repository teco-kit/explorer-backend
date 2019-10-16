const config = require('config');
const request = require('request-promise-native');
const Model = require('../models/user').model;

module.exports = async (ctx, next) => {
	if (ctx.headers.authorization) {
		// request sends 'Bearer ' so remove it from token
		const token = ctx.headers.authorization.replace('Bearer ', '');
		let authId = '';
		// call auth server to authenticate with jwt
		await request.post(config.auth, async (error, response, body) => {
			if (error) {
				ctx.status = 401;
				ctx.body = {
					error: 'Unauthorized'
				};
			} else {
				// auth server returns user id, to store with user object
				// check if we see this user for the first time: do we have this authId already in db?
				authId = (JSON.parse(body)).userId;
				const user = await Model.find({authId});
				if (!user.length) {
					// if not, create a new user object
					const document = new Model({authId});
					await document.save();
				}
			}
		}).auth(null, null, true, token);
		// only return data associated with this user id
		// add authId to ctx so we can use it later
		ctx.state.authId = authId;
		await next();
	} else {
		// no token provided
		ctx.status = 401;
		ctx.body = {
			error: 'Please provide a valid JWT token'
		};
	}
};
