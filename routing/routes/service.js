const Router      = require('koa-router');
const KoaBody      = require('koa-body');

const controller = require('../../controller/service');

const router = new Router();

/**
 * get all services for current user
 * route:					/services
 * method type: 	GET
 */
router.get('/', async (ctx) => {
	await controller.getServices(ctx);
});

/**
 * get service by id
 * route:					/services/:id
 * method type: 	GET
 */
router.get('/:id', async (ctx) => {
	await controller.getServiceById(ctx);
});

/**
 * create a new service
 * route:					/services
 * method type: 	POST
 */
router.post('/', KoaBody(), async (ctx) => {
	await controller.createService(ctx);
});

/**
 * update a specific services
 * route:					/services/:id
 * method type: 	PUT
 */
router.put('/:id', KoaBody(), async (ctx) => {
	await controller.updateServiceById(ctx);
});

/**
 * delete all services
 * route:					/services
 * method type: 	DELETE
 */
router.del('/', async (ctx) => {
	await controller.deleteServices(ctx);
});

/**
 * delete a specific service
 * route:					/services/:id
 * method type: 	DELETE
 */
router.del('/:id', async (ctx) => {
	await controller.deleteServiceById(ctx);
});


module.exports = router;
