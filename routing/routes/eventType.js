const Router      = require('koa-router');
const KoaBody      = require('koa-body');

// import controller
const eventTypeController = require('../../controller/eventType');

// mounted at /users
const eventTypeRouter = new Router();

/**
 * get all event
 * route:					/events/
 * method type: 	GET
 */
eventTypeRouter.get('/', async (ctx) => {
	await eventTypeController.getEvents(ctx);
});

/**
 * get eventType by Id
 * route:					/events//:id
 * method type: 	GET
 */
eventTypeRouter.get('/:id', async (ctx) => {
	await eventTypeController.getEventById(ctx);
});

/**
 * create a new eventType
 * route:					/events/
 * method type: 	POST
 */
eventTypeRouter.post('/', KoaBody(), async (ctx) => {
	await eventTypeController.createEvent(ctx);
});

/** run
 * for handling requests that try to POST a new event type
 * with id -> Method not allowed (405)
 * route:					/events//:id
 * method type: 	POST
 */
eventTypeRouter.post('/:id', async (ctx) => {
	ctx.status = 500;
	ctx.body = {error: 'Method Not Allowed'};
});

/**
 * update a bulk of event
 * route:					/events//
 * method type: 	PUT
 */
eventTypeRouter.put('/', KoaBody(), async (ctx) => {
	await eventTypeController.updateEvents(ctx);
});

/**
 * update a event type specified by id
 * route:					/events//:id
 * method type: 	PUT
 */
eventTypeRouter.put('/:id', KoaBody(), async (ctx) => {
	await eventTypeController.updateEventById(ctx);
});

/**
 * delete all event
 * route:					/events//
 * method type: 	DELETE
 */
eventTypeRouter.del('/', async (ctx) => {
	await eventTypeController.deleteEvents(ctx);
});

/**
 * delete a user specified by id
 * route:					/users/:id
 * method type: 	DELETE
 */
eventTypeRouter.del('/:id', async (ctx) => {
	await eventTypeController.deleteEventById(ctx);
});


module.exports = eventTypeRouter;
