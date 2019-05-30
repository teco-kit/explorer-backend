const Router = require('koa-router');

// authentication
const router = {
	unprotected: new Router(),
	protected: new Router(),
};

// subroutes to be mounted
const subroutes = {
	datasets: require('./datasets'),
	users: require('./users'),
	firmware: require('./firmware'),
	events: require('./eventTypes'),
	label: require('./labels'),
	labeling: require('./labelings')
};

// authenticated route for explorer
router.protected.get('/auth', (ctx) => {
	ctx.status = 200;
	ctx.body = {
		authed: true
	};
});

// dataset routes
// TODO: change again to protected
router.unprotected.use('/datasets', subroutes.datasets.routes(), subroutes.datasets.allowedMethods());
router.unprotected.use('/users', subroutes.users.routes(), subroutes.users.allowedMethods());
router.unprotected.use('/firmware', subroutes.firmware.routes(), subroutes.firmware.allowedMethods());
router.unprotected.use('/events/types', subroutes.events.routes(), subroutes.events.allowedMethods());
router.unprotected.use('/labels', subroutes.label.routes(), subroutes.label.allowedMethods());
router.unprotected.use('/labelings', subroutes.labeling.routes(), subroutes.labeling.allowedMethods());

module.exports = router;
