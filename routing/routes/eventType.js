const Router      = require('koa-router');
const KoaBody      = require('koa-body');

const controller = require('../../controller/eventType');

const router = new Router();

/**
 * get all event
 * route:					/events/
 * method type: 	GET
 */
router.get('/', async (ctx) => {
	await controller.getEventTypes(ctx);
});

/**
 * get eventType by Id
 * route:					/events//:id
 * method type: 	GET
 */
router.get('/:id', async (ctx) => {
	await controller.getEventTypeById(ctx);
});

/**
 * create a new eventType
 * route:					/events/
 * method type: 	POST
 */
router.post('/', KoaBody(), async (ctx) => {
	await controller.createEventType(ctx);
});

/**
 * update a event type specified by id
 * route:					/events//:id
 * method type: 	PUT
 */
router.put('/:id', KoaBody(), async (ctx) => {
	await controller.updateEventTypeById(ctx);
});

/**
 * delete all event
 * route:					/events//
 * method type: 	DELETE
 */
router.del('/', async (ctx) => {
	await controller.deleteEventTypes(ctx);
});

/**
 * delete a user specified by id
 * route:					/users/:id
 * method type: 	DELETE
 */
router.del('/:id', async (ctx) => {
	await controller.deleteEventTypeById(ctx);
});


module.exports = router;
