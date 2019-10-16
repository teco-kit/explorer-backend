const Router      = require('koa-router');
const KoaBody      = require('koa-body');

const controller = require('../../controller/firmware');

const router = new Router();

/**
 * get all firmware
 * route:					/firmware
 * method type: 	GET
 */
router.get('/', async (ctx) => {
	await controller.getFirmware(ctx);
});

/**
 * get firmware by id
 * route:					/firmware/:id
 * method type: 	GET
 */
router.get('/:id', async (ctx) => {
	await controller.getFirmwareById(ctx);
});

/**
 * create a new firmware
 * route:					/firmware
 * method type: 	POST
 */
router.post('/', KoaBody(), async (ctx) => {
	await controller.createFirmware(ctx);
});

/**
 * for handling requests that try to POST a new firmware
 * with id -> Method not allowed (405)
 * route:					/firmware/:id
 * method type: 	POST
 */
router.post('/:id', async (ctx) => {
	ctx.status = 500;
	ctx.body = {error: 'Method Not Allowed'};
});

/**
 * update a bulk of firmware
 * route:					/firmware
 * method type: 	PUT
 */
router.put('/', KoaBody(), async (ctx) => {
	await controller.updateFirmware(ctx);
});

/**
 * update a firmware specified by id
 * route:					/firmware/:id
 * method type: 	PUT
 */
router.put('/:id', KoaBody(), async (ctx) => {
	await controller.updateFirmwareById(ctx);
});

/**
 * delete all firmware
 * route:					/firmware
 * method type: 	DELETE
 */
router.del('/', async (ctx) => {
	await controller.deleteFirmware(ctx);
});

/**
 * delete a firmware specified by id
 * route:					/firmware/:id
 * method type: 	DELETE
 */
router.del('/:id', async (ctx) => {
	await controller.deleteFirmwareById(ctx);
});


module.exports = router;
