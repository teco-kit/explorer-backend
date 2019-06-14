const Router      = require('koa-router');
const KoaBody      = require('koa-body');

// import controller
const videoController = require('../../../controller/video');

// mounted at /videos
const videoRouter = new Router();

/**
 * get video for dataset
 * route:					/datasets/{id}/video
 * method type: 	GET
 */
videoRouter.get('/', async (ctx) => {
	await videoController.getVideoById(ctx);
});

/**
 * create a new video
 * route:					/datasets/{id}/video
 * method type: 	POST
 */
videoRouter.post('/', KoaBody(), async (ctx) => {
	await videoController.createVideo(ctx);
});

/**
 * for handling requests that try to POST a new video
 * with id -> Method not allowed (405)
 * route:					/datasets/{id}/video/:id
 * method type: 	POST
 */
videoRouter.post('/:id', async (ctx) => {
	ctx.status = 500;
	ctx.body = {error: 'Method Not Allowed'};
});

/**
 * update video
 * route:					/datasets/{id}/video
 * method type: 	PUT
 */
videoRouter.put('/', KoaBody(), async (ctx) => {
	await videoController.updateVideo(ctx);
});

/**
 * delete video
 * route:					/datasets/{id}/video
 * method type: 	DELETE
 */
videoRouter.del('/', async (ctx) => {
	await videoController.deleteVideo(ctx);
});


module.exports = videoRouter;
