const Router      = require('koa-router');
const KoaBody      = require('koa-body');

const controller = require('../../controller/user');

const router = new Router();

/**
 * get all users
 * route:					/users
 * method type: 	GET
 */
router.get('/', KoaBody(), async (ctx, next) => {
	await controller.getUsers(ctx, next);
});

/**
 * update user
 * route:					/users
 * method type: 	PUT
 */
router.put('/', KoaBody(), async (ctx) => {
	await controller.updateUser(ctx);
});

/**
 * delete all users
 * route:					/users
 * method type: 	DELETE
 */
router.del('/', async (ctx) => {
	await controller.deleteUsers(ctx);
});

/**
 * delete a user specified by id
 * route:					/users/:id
 * method type: 	DELETE
 */
router.del('/:id', async (ctx) => {
	await controller.deleteUserById(ctx);
});


module.exports = router;
