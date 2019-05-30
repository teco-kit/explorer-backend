const Router      = require('koa-router');
const KoaBody      = require('koa-body');

// import controller
const firmwareController = require('../controller/firmwareController');

// mounted at /firmware
const firmwareRouter = new Router();

/**
 * get all firmware
 * route:					/firmware
 * method type: 	GET
 */
firmwareRouter.get('/', async (ctx) => {
	await firmwareController.getFirmware(ctx);
});

/**
 * get firmware by id
 * route:					/firmware/:id
 * method type: 	GET
 */
firmwareRouter.get('/:id', async (ctx) => {
	await firmwareController.getFirmwareById(ctx);
});

/**
 * create a new firmware
 * route:					/firmware
 * method type: 	POST
 */
firmwareRouter.post('/', KoaBody(), async (ctx) => {
	await firmwareController.createFirmware(ctx);
});

/**
 * for handling requests that try to POST a new firmware
 * with id -> Method not allowed (405)
 * route:					/firmware/:id
 * method type: 	POST
 */
firmwareRouter.post('/:id', async (ctx) => {
	ctx.status = 500;
	ctx.body = {error: 'Method Not Allowed'};
});

/**
 * update a bulk of firmware
 * route:					/firmware
 * method type: 	PUT
 */
firmwareRouter.put('/', KoaBody(), async (ctx) => {
	await firmwareController.updateFirmware(ctx);
});

/**
 * update a firmware specified by id
 * route:					/firmware/:id
 * method type: 	PUT
 */
firmwareRouter.put('/:id', KoaBody(), async (ctx) => {
	await firmwareController.updateFirmwareById(ctx);
});

/**
 * delete all firmware
 * route:					/firmware
 * method type: 	DELETE
 */
firmwareRouter.del('/', async (ctx) => {
	await firmwareController.deleteFirmware(ctx);
});

/**
 * delete a firmware specified by id
 * route:					/firmware/:id
 * method type: 	DELETE
 */
firmwareRouter.del('/:id', async (ctx) => {
	await firmwareController.deleteFirmwareById(ctx);
});


module.exports = firmwareRouter;
