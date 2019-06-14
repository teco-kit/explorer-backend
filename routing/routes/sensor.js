const Router      = require('koa-router');
const KoaBody      = require('koa-body');

// import controller
const sensorController = require('../../controller/sensor');

// mounted at /sensors
const sensorRouter = new Router();

/**
 * get all sensors for current user
 * route:					/sensors
 * method type: 	GET
 */
sensorRouter.get('/', async (ctx) => {
	await sensorController.getSensors(ctx);
});

/**
 * get sensor by id
 * route:					/sensors/:id
 * method type: 	GET
 */
sensorRouter.get('/:id', async (ctx) => {
	await sensorController.getSensorById(ctx);
});

/**
 * create a new sensor
 * route:					/sensors
 * method type: 	POST
 */
sensorRouter.post('/', KoaBody(), async (ctx) => {
	await sensorController.createSensor(ctx);
});

/**
 * for handling requests that try to POST a new sensor
 * with id -> Method not allowed (405)
 * route:					/sensors/:id
 * method type: 	POST
 */
sensorRouter.post('/:id', async (ctx) => {
	ctx.status = 500;
	ctx.body = {error: 'Method Not Allowed'};
});

/**
 *  update a bulk of sensors
 * route:					/sensors
 * method type: 	PUT
 */
sensorRouter.put('/', KoaBody(), async (ctx) => {
	await sensorController.updateSensors(ctx);
});

/**
 * update a specific sensors
 * route:					/sensors/:id
 * method type: 	PUT
 */
sensorRouter.put('/:id', KoaBody(), async (ctx) => {
	await sensorController.updateSensorById(ctx);
});

/**
 * delete all sensors
 * route:					/sensors
 * method type: 	DELETE
 */
sensorRouter.del('/', async (ctx) => {
	await sensorController.deleteSensors(ctx);
});

/**
 * delete a specific sensor
 * route:					/Sensors/:id
 * method type: 	DELETE
 */
sensorRouter.del('/:id', async (ctx) => {
	await sensorController.deleteSensorById(ctx);
});


module.exports = sensorRouter;
