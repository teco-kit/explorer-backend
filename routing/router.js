const Router = require('koa-router');

const prefixRouter =  new Router();
const router =  new Router();

// subroutes to be mounted
const subroutes = {
	datasets: require('./routes/dataset'),
	users: require('./routes/user'),
	firmware: require('./routes/firmware'),
	eventTypes: require('./routes/eventType'),
	label: require('./routes/labelType'),
	labelDefinitions: require('./routes/labelDefinition'),
	device: require('./routes/device'),
	service: require('./routes/service'),
	sensor: require('./routes/sensor'),
  experiments: require('./routes/experiment')
};

// dataset routing
router.use('/datasets', subroutes.datasets.routes(), subroutes.datasets.allowedMethods());
router.use('/users', subroutes.users.routes(), subroutes.users.allowedMethods());
router.use('/firmware', subroutes.firmware.routes(), subroutes.firmware.allowedMethods());
router.use('/eventTypes', subroutes.eventTypes.routes(), subroutes.eventTypes.allowedMethods());
router.use('/labelTypes', subroutes.label.routes(), subroutes.label.allowedMethods());
router.use('/labelDefinitions', subroutes.labelDefinitions.routes(), subroutes.labelDefinitions.allowedMethods());
router.use('/devices', subroutes.device.routes(), subroutes.device.allowedMethods());
router.use('/services', subroutes.service.routes(), subroutes.service.allowedMethods());
router.use('/sensors', subroutes.sensor.routes(), subroutes.sensor.allowedMethods());
router.use('/experiments', subroutes.experiments.routes(), subroutes.experiments.allowedMethods());

prefixRouter.use('/api', router.routes(), router.allowedMethods());
module.exports = prefixRouter;
