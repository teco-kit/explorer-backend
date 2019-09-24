const config = require('config');
const request = require('request');

module.exports = async (ctx, next) => {
	if(process.env.NODE_ENV !== 'testing') {
		try {
			if(ctx.headers.authorization) {
				// request sends 'Bearer ' so remove it from token
				const token = ctx.headers.authorization.replace('Bearer ', '');
				// call auth server to authenticate with jwt
				request.post(config.auth, async (error, response, body) => {
					if (error) {
						throw error;
					} else {
						// auth server returns user id, to store with user object
						// TODO
						// only return data associated with this user id
						// TODO
						console.log(body);
					}
				}).auth(null, null, true, token);
				await next();
			} else {
				// no token provided
				throw new Error();
			}
		} catch (error) {
			ctx.status = 401;
			ctx.body = {
				error: 'Unauthorized'
			};
		}
		return ctx;
	}
	await next();
};
