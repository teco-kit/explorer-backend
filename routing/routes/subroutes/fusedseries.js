const Router      = require('koa-router');
const KoaBody      = require('koa-body');

const controller = require('../../../controller/fusedseries');

const router = new Router();

/**
 * get all fusedseries for current user
 * route:					/datasets/{id}/fusedseries
 * method type: 	GET
 */
router.get('/', async (ctx) => {
	await controller.getFusedseries(ctx);
});

/**
 * get fusedserie by id
 * route:					/datasets/{id}/fusedseries/:id
 * method type: 	GET
 */
router.get('/:id', async (ctx) => {
	await controller.getFusedserieById(ctx);
});

/**
 * create a new fusedserie
 * route:					/datasets/{id}/fusedseries
 * method type: 	POST
 */
router.post('/', KoaBody(), async (ctx) => {
	await controller.createFusedserie(ctx);
});

/**
 * update a specific fusedseries
 * route:					/datasets/{id}/fusedseries/:id
 * method type: 	PUT
 */
router.put('/:id', KoaBody(), async (ctx) => {
	await controller.updateFusedserieById(ctx);
});

/**
 * delete all fusedseries
 * route:					/datasets/{id}/fusedseries
 * method type: 	DELETE
 */
router.del('/', async (ctx) => {
	await controller.deleteFusedseries(ctx);
});

/**
 * delete a specific fusedserie
 * route:					/datasets/{id}/Fusedseries/:id
 * method type: 	DELETE
 */
router.del('/:id', async (ctx) => {
	await controller.deleteFusedserieById(ctx);
});


module.exports = router;
