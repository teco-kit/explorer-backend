const Router    = require('koa-router');

// authentication
const router = {
	unprotected: new Router(),
	protected: new Router(),
};

// subroutes to be mounted
const subroutes = {
	dataset: require('./dataset'),
	datasets: require('./datasets'),
	firmware: require('./firmware'),
	emulator: require('./emulator'),
	analyses: require('./analyses'),
};

// firmware routes
router.unprotected.use('/firmware', subroutes.firmware.routes(), subroutes.firmware.allowedMethods());

// emulator routes for testing
router.unprotected.use('/emulator', subroutes.emulator.routes(), subroutes.emulator.allowedMethods());

// authed route for explorer
router.protected.get('/authed', (ctx) => {
	ctx.status = 200;
	ctx.body = {
		authed: true
	};
});

// analyses routes
router.protected.use('/analyses', subroutes.analyses.routes(), subroutes.analyses.allowedMethods());

// dataset routes
router.protected.use('/dataset', subroutes.dataset.routes(), subroutes.dataset.allowedMethods());

// datasets routes
router.protected.use('/datasets', subroutes.datasets.routes(), subroutes.datasets.allowedMethods());

module.exports = router;
