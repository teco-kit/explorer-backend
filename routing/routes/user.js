const Router      = require('koa-router');
const KoaBody      = require('koa-body');

// import controller
const userController = require('../../controller/user');

// mounted at /users
const userRouter = new Router();

/**
 * get all users
 * route:					/users
 * method type: 	GET
 */
userRouter.get('/', KoaBody(), async (ctx, next) => {
	await userController.getUsers(ctx, next);
});

/**
 * update user
 * route:					/users
 * method type: 	PUT
 */
userRouter.put('/', KoaBody(), async (ctx) => {
	await userController.updateUser(ctx);
});

/**
 * delete all users
 * route:					/users
 * method type: 	DELETE
 */
userRouter.del('/', async (ctx) => {
	await userController.deleteUsers(ctx);
});

/**
 * delete a user specified by id
 * route:					/users/:id
 * method type: 	DELETE
 */
userRouter.del('/:id', async (ctx) => {
	await userController.deleteUserById(ctx);
});


module.exports = userRouter;
