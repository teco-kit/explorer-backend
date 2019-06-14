const Router      = require('koa-router');
const KoaBody      = require('koa-body');

// import controller
const eventController = require('../../../controller/datasetEvent');

// mounted at /events
const eventRouter = new Router();

/**
 * get all events for current user
 * route:					/datasets/{id}/events
 * method type: 	GET
 */
eventRouter.get('/', async (ctx) => {
	await eventController.getEvents(ctx);
});

/**
 * get event by id
 * route:					/datasets/{id}/events/:id
 * method type: 	GET
 */
eventRouter.get('/:id', async (ctx) => {
	await eventController.getEventById(ctx);
});

/**
 * create a new event
 * route:					/datasets/{id}/events
 * method type: 	POST
 */
eventRouter.post('/', KoaBody(), async (ctx) => {
	await eventController.createEvent(ctx);
});

/**
 * for handling requests that try to POST a new event
 * with id -> Method not allowed (405)
 * route:					/datasets/{id}/events/:id
 * method type: 	POST
 */
eventRouter.post('/:id', async (ctx) => {
	ctx.status = 500;
	ctx.body = {error: 'Method Not Allowed'};
});

/**
 *  update a bulk of events
 * route:					/datasets/{id}/events
 * method type: 	PUT
 */
eventRouter.put('/', KoaBody(), async (ctx) => {
	await eventController.updateEvents(ctx);
});

/**
 * update a specific events
 * route:					/datasets/{id}/events/:id
 * method type: 	PUT
 */
eventRouter.put('/:id', KoaBody(), async (ctx) => {
	await eventController.updateEventById(ctx);
});

/**
 * delete all events
 * route:					/datasets/{id}/events
 * method type: 	DELETE
 */
eventRouter.del('/', async (ctx) => {
	await eventController.deleteEvents(ctx);
});

/**
 * delete a specific event
 * route:					/datasets/{id}/Events/:id
 * method type: 	DELETE
 */
eventRouter.del('/:id', async (ctx) => {
	await eventController.deleteEventById(ctx);
});


module.exports = eventRouter;
