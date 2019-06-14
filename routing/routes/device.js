const Router      = require('koa-router');
const KoaBody      = require('koa-body');

// import controller
const deviceController = require('../../controller/device');

// mounted at /devices
const deviceRouter = new Router();

/**
 * get all devices for current user
 * route:					/devices
 * method type: 	GET
 */
deviceRouter.get('/', async (ctx) => {
	await deviceController.getDevices(ctx);
});

/**
 * get device by id
 * route:					/devices/:id
 * method type: 	GET
 */
deviceRouter.get('/:id', async (ctx) => {
	await deviceController.getDeviceById(ctx);
});

/**
 * create a new device
 * route:					/devices
 * method type: 	POST
 */
deviceRouter.post('/', KoaBody(), async (ctx) => {
	await deviceController.createDevice(ctx);
});

/**
 * for handling requests that try to POST a new device
 * with id -> Method not allowed (405)
 * route:					/devices/:id
 * method type: 	POST
 */
deviceRouter.post('/:id', async (ctx) => {
	ctx.status = 500;
	ctx.body = {error: 'Method Not Allowed'};
});

/**
 *  update a bulk of devices
 * route:					/devices
 * method type: 	PUT
 */
deviceRouter.put('/', KoaBody(), async (ctx) => {
	await deviceController.updateDevices(ctx);
});

/**
 * update a specific devices
 * route:					/devices/:id
 * method type: 	PUT
 */
deviceRouter.put('/:id', KoaBody(), async (ctx) => {
	await deviceController.updateDeviceById(ctx);
});

/**
 * delete all devices
 * route:					/devices
 * method type: 	DELETE
 */
deviceRouter.del('/', async (ctx) => {
	await deviceController.deleteDevices(ctx);
});

/**
 * delete a specific device
 * route:					/devices/:id
 * method type: 	DELETE
 */
deviceRouter.del('/:id', async (ctx) => {
	await deviceController.deleteDeviceById(ctx);
});


module.exports = deviceRouter;
