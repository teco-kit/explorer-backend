const Router = require('koa-router');
const KoaSend = require('koa-send');

// authentication
const router = {
	unprotected: new Router(),
	protected: new Router(),
};

// subroutes to be mounted
const subroutes = {
	datasets: require('./routes/dataset'),
	users: require('./routes/user'),
	firmware: require('./routes/firmware'),
	events: require('./routes/eventType'),
	label: require('./routes/label'),
	labeling: require('./routes/labeling'),
	device: require('./routes/device'),
	service: require('./routes/service'),
	sensor: require('./routes/sensor'),
};

// authenticated route for explorer
router.protected.get('/auth', (ctx) => {
	ctx.status = 200;
	ctx.body = {
		authed: true
	};
});

// dataset routing
// TODO: change again to protected
router.unprotected.use('/datasets', subroutes.datasets.routes(), subroutes.datasets.allowedMethods());
router.unprotected.use('/users', subroutes.users.routes(), subroutes.users.allowedMethods());
router.unprotected.use('/firmware', subroutes.firmware.routes(), subroutes.firmware.allowedMethods());
router.unprotected.use('/events', subroutes.events.routes(), subroutes.events.allowedMethods());
router.unprotected.use('/labels', subroutes.label.routes(), subroutes.label.allowedMethods());
router.unprotected.use('/labelings', subroutes.labeling.routes(), subroutes.labeling.allowedMethods());
router.unprotected.use('/devices', subroutes.device.routes(), subroutes.device.allowedMethods());
router.unprotected.use('/services', subroutes.service.routes(), subroutes.service.allowedMethods());
router.unprotected.use('/sensors', subroutes.sensor.routes(), subroutes.sensor.allowedMethods());

// public routes for service info
// serve badge
router.unprotected.get('/badge.svg', async (ctx) => {
	await KoaSend(ctx, './public/badge.svg');
});

// health check
router.unprotected.get('/healthcheck', async (ctx) => {
	ctx.status = 200;
	ctx.body = {message: 'nice proprietary software!'};
});

module.exports = router;
