const Router = require('koa-router');

const router =  new Router();

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

// dataset routing
router.use('/datasets', subroutes.datasets.routes(), subroutes.datasets.allowedMethods());
router.use('/users', subroutes.users.routes(), subroutes.users.allowedMethods());
router.use('/firmware', subroutes.firmware.routes(), subroutes.firmware.allowedMethods());
router.use('/events', subroutes.events.routes(), subroutes.events.allowedMethods());
router.use('/labels', subroutes.label.routes(), subroutes.label.allowedMethods());
router.use('/labelings', subroutes.labeling.routes(), subroutes.labeling.allowedMethods());
router.use('/devices', subroutes.device.routes(), subroutes.device.allowedMethods());
router.use('/services', subroutes.service.routes(), subroutes.service.allowedMethods());
router.use('/sensors', subroutes.sensor.routes(), subroutes.sensor.allowedMethods());

module.exports = router;
