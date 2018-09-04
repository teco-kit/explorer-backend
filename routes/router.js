const Router    = require('koa-router');

// authentication
const router = {
	unprotected: new Router(),
	protected: new Router(),
};

// subroutes to be mounted
const subroutes = {
	dataset: require('./dataset'),
	firmware: require('./firmware'),
};

// firmware routes
router.unprotected.use('/firmware', subroutes.firmware.routes(), subroutes.firmware.allowedMethods());

// dataset routes
router.protected.use('/dataset', subroutes.dataset.routes(), subroutes.dataset.allowedMethods());

module.exports = router;
