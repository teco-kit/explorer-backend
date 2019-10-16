const Router = require('koa-router');

const router =  new Router();

// subroutes to be mounted
const subroutes = {
	datasets: require('./routes/dataset'),
	users: require('./routes/user'),
	firmware: require('./routes/firmware'),
	eventTypes: require('./routes/eventType'),
	label: require('./routes/label'),
	labelDefinitions: require('./routes/labelDefinition'),
	device: require('./routes/device'),
	service: require('./routes/service'),
	sensor: require('./routes/sensor'),
	instructions: require('./routes/instruction')
};

// dataset routing
router.use('/datasets', subroutes.datasets.routes(), subroutes.datasets.allowedMethods());
router.use('/users', subroutes.users.routes(), subroutes.users.allowedMethods());
router.use('/firmware', subroutes.firmware.routes(), subroutes.firmware.allowedMethods());
router.use('/eventTypes', subroutes.eventTypes.routes(), subroutes.eventTypes.allowedMethods());
router.use('/labels', subroutes.label.routes(), subroutes.label.allowedMethods());
router.use('/labelDefinitions', subroutes.labelDefinitions.routes(), subroutes.labelDefinitions.allowedMethods());
router.use('/devices', subroutes.device.routes(), subroutes.device.allowedMethods());
router.use('/services', subroutes.service.routes(), subroutes.service.allowedMethods());
router.use('/sensors', subroutes.sensor.routes(), subroutes.sensor.allowedMethods());
router.use('/instructions', subroutes.instructions.routes(), subroutes.instructions.allowedMethods());

module.exports = router;
