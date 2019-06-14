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
userRouter.get('/', async (ctx) => {
	await userController.getUsers(ctx);
});

/**
 * get user by id
 * route:					/users/:id
 * method type: 	GET
 */
userRouter.get('/:id', async (ctx) => {
	await userController.getUserById(ctx);
});

/**
 * create a new user
 * route:					/users
 * method type: 	POST
 */
userRouter.post('/', KoaBody(), async (ctx) => {
	await userController.createUser(ctx);
});

/**
 * for handling requests that try to POST a new user
 * with id -> Method not allowed (405)
 * route:					/users/:id
 * method type: 	POST
 */
userRouter.post('/:id', async (ctx) => {
	ctx.status = 500;
	ctx.body = {error: 'Method Not Allowed'};
});

/**
 * update a bulk of users
 * route:					/users
 * method type: 	PUT
 */
userRouter.put('/', KoaBody(), async (ctx) => {
	await userController.updateUsers(ctx);
});

/**
 * update a user specified by id
 * route:					/users/:id
 * method type: 	PUT
 */
userRouter.put('/:id', KoaBody(), async (ctx) => {
	await userController.updateUserById(ctx);
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
