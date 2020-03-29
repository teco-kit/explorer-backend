// blacklist of disallowed paths for normal users, only admins can access these routes
// example: /api/services
const adminRoutes = {
	GET: [],
	POST: [],
	PUT: [],
	DELETE: []
};

function isAdminRoute(method, path) {
	return adminRoutes[method].indexOf(path) !== -1;
}

function isAdmin(role) {
	return role === 'admin';
}

module.exports = (ctx, next) => {
	if(!isAdminRoute(ctx.request.method, ctx.request.path)
		|| (isAdminRoute(ctx.request.method, ctx.request.path) && isAdmin(ctx.state.role))) {
		return next();
	}
	ctx.status = 403;
	ctx.body = {
		error: 'Forbidden'
	};
	return ctx;
};
