const Router      = require('koa-router');
const KoaBody      = require('koa-body');

// import controller
const eventTypeController = require('../controller/eventTypeController');

// mounted at /users
const eventTypeRouter = new Router();

/**
 * get all eventTypes
 * route:					/events/types
 * method type: 	GET
 */
eventTypeRouter.get('/', async (ctx) => {
	await eventTypeController.getEventTypes(ctx);
});

/**
 * get eventType by Id
 * route:					/events/types/:id
 * method type: 	GET
 */
eventTypeRouter.get('/:id', async (ctx) => {
	await eventTypeController.getEventTypeById(ctx);
});

/**
 * create a new eventType
 * route:					/events/types
 * method type: 	POST
 */
eventTypeRouter.post('/', KoaBody(), async (ctx) => {
	await eventTypeController.createEventType(ctx);
});

/** run
 * for handling requests that try to POST a new event type
 * with id -> Method not allowed (405)
 * route:					/events/types/:id
 * method type: 	POST
 */
eventTypeRouter.post('/:id', async (ctx) => {
	ctx.status = 500;
	ctx.body = {error: 'Method Not Allowed'};
});

/**
 * update a bulk of event types
 * route:					/events/types/
 * method type: 	PUT
 */
eventTypeRouter.put('/', KoaBody(), async (ctx) => {
	await eventTypeController.updateEventTypes(ctx);
});

/**
 * update a event type specified by id
 * route:					/events/types/:id
 * method type: 	PUT
 */
eventTypeRouter.put('/:id', KoaBody(), async (ctx) => {
	ctx = await eventTypeController.updateEventTypeById(ctx);
	console.log(ctx);
});

/**
 * delete all event types
 * route:					/events/types/
 * method type: 	DELETE
 */
eventTypeRouter.del('/', async (ctx) => {
	await eventTypeController.deleteEventTypes(ctx);
});

/**
 * delete a user specified by id
 * route:					/users/:id
 * method type: 	DELETE
 */
eventTypeRouter.del('/:id', async (ctx) => {
	await eventTypeController.deleteEventTypeById(ctx);
});


module.exports = eventTypeRouter;
