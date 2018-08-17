const Router    = require('koa-router');

// authentication
const router = {
	unprotected: new Router(),
	protected: new Router(),
};

// subroutes to be mounted
const subroutes = {
	dataset: require('./dataset'),
};

// dataset routes
router.protected.use('/dataset', subroutes.dataset.routes(), subroutes.dataset.allowedMethods());

module.exports = router;
