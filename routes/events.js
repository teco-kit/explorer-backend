const Router      = require('koa-router');
const KoaBody      = require('koa-body');

// import controller
const userController = require('../controller/userController');

// mounted at /users
const userRouter = new Router();

/**
 * get all users
 * route:					/users
 * method type: 	GET
 */
userRouter.get('/', async (ctx) => {
	ctx.body = await userController.getUsers();
});

/**
 * get user by id
 * route:					/users/:id
 * method type: 	GET
 */
userRouter.get('/:id', async (ctx) => {
	console.log(ctx.params.id);
	ctx.body = await userController.getUserById(ctx.params.id);
});

/**
 * get user by name
 * route:					/users/:name //TODO: geht das bei Strings auch mit doppelpunkt?
 * method type: 	GET
 */
userRouter.get('/:id', async (ctx) => {
	console.log(ctx.params.id);
	ctx.body = await userController.getUserByName(ctx.params.id);
});

/**
 * create a new user
 * route:					/users
 * method type: 	POST
 */
userRouter.post('/', KoaBody(), async (ctx) => {
	ctx.set('Content-Type', 'application/json');
	console.log(ctx.request.body);
	const status = await userController.createUser(ctx.request.body);
	if (status === 400) {
		ctx.status = 400;
		ctx.body = {message: 'Bad Request'};
	} else if(status === 201) {
		ctx.status = 201;
		ctx.body = {message: 'Resource created'};
	}
});

/**
 * for handling requests that try to POST a new user
 * with id -> Method not allowed (405)
 * route:					/users/:id
 * method type: 	POST
 */
userRouter.post('/:id', async (ctx) => {
	ctx.response.status(405);
});

/**
 * update a bulk of users
 * route:					/users
 * method type: 	PUT
 */
userRouter.put('/', async (ctx) => {
	console.log(ctx.request.body);
	const status = await userController.updateUsers(ctx.request.body);
	if (status === 400) {
		ctx.response.status = 400;
		ctx.body = {message: 'Bad Request'};
	} else if(status === 200) {
		ctx.response.status = 200;
		ctx.body = {message: 'Resource created'};
	}
});

/**
 * update a user specified by id
 * route:					/users/:id
 * method type: 	PUT
 */
userRouter.put('/:id', async (ctx) => {
	console.log(ctx.request.body);
	const status = await userController.updateUserById(ctx.params.id);
	if (status === 400) {
		ctx.response.status = 400;
		ctx.body = {message: 'Bad Request'};
	} else if(status === 200) {
		ctx.response.status = 200;
		ctx.body = {message: 'Resource created'};
	}
});

/**
 * update a user specified by name
 * route:					/users/:id
 * method type: 	PUT
 */
userRouter.put('/:id', async (ctx) => {
	console.log(ctx.request.body);
	const status = await userController.updateUserByName(ctx.params.id);
	if (status === 400) {
		ctx.response.status = 400;
		ctx.body = {message: 'Bad Request'};
	} else if(status === 200) {
		ctx.response.status = 200;
		ctx.body = {message: 'Resource created'};
	}
});

/**
 * delete all users
 * route:					/users
 * method type: 	DELETE
 */
userRouter.del('/', async (ctx) => {
	const status = await userController.deleteUsers();
	if (status === 400) {
		ctx.response.status = 400;
		ctx.body = {message: 'Bad Request'};
	} else if(status === 204) {
		ctx.response.status = 204;
		ctx.body = {message: 'Resource deleted'};
	}
});

/**
 * delete a user specified by id
 * route:					/users/:id
 * method type: 	DELETE
 */
userRouter.del('/:id', async (ctx) => {
	console.log(ctx.params.id);
	const status = await userController.deleteUserById(ctx.params.id);
	if (status === 400) {
		ctx.response.status = 400;
		ctx.body = {message: 'Bad Request'};
	} else if(status === 204) {
		ctx.response.status = 204;
		ctx.body = {message: 'Resource created'};
	}
});

/**
 * delete a user specified by name
 * route:					/users/:id
 * method type: 	DELETE
 */
userRouter.del('/:name', async (ctx) => { //TODO: da muss es was geben
	console.log(ctx.params.id);
	const status = await userController.deleteUserByName(ctx.params.id);
	if (status === 400) {
		ctx.response.status = 400;
		ctx.body = {message: 'Bad Request'};
	} else if(status === 204) {
		ctx.response.status = 204;
		ctx.body = {message: 'Resource created'};
	}
});


module.exports = userRouter;
