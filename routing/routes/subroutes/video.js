const Router      = require('koa-router');
const KoaBody      = require('koa-body');

const controller = require('../../../controller/video');

const router = new Router();

/**
 * get video for dataset
 * route:					/datasets/{id}/video
 * method type: 	GET
 */
router.get('/', async (ctx) => {
	await controller.getVideo(ctx);
});

/**
 * create a new video
 * route:					/datasets/{id}/video
 * method type: 	POST
 */
router.post('/', KoaBody(), async (ctx) => {
	await controller.createVideo(ctx);
});

/**
 * update video
 * route:					/datasets/{id}/video
 * method type: 	PUT
 */
router.put('/', KoaBody(), async (ctx) => {
	await controller.updateVideo(ctx);
});

/**
 * delete video
 * route:					/datasets/{id}/video
 * method type: 	DELETE
 */
router.del('/', async (ctx) => {
	await controller.deleteVideo(ctx);
});


module.exports = router;
