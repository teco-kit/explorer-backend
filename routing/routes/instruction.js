const Router       = require('koa-router');
const KoaBody      = require('koa-body');

const controller = require('../../controller/instruction');

const router = new Router();

/**
 * get all instructions
 * route:					/instructions
 * method type: 	GET
 */
router.get('/', async (ctx) => {
	await controller.getInstructions(ctx);
});

/**
 * get instruction by id
 * route:					/instructions/:id
 * method type: 	GET
 */
router.get('/:id', async (ctx) => {
	await controller.getInstructionById(ctx);
});

/**
 * create a new instruction
 * route:					/instructions
 * method type: 	POST
 */
router.post('/', KoaBody(), async (ctx) => {
	await controller.createInstruction(ctx);
});

/**
 * update a specific instructions
 * route:					/instructions/:id
 * method type: 	PUT
 */
router.put('/:id', KoaBody(), async (ctx) => {
	await controller.updateInstructionById(ctx);
});

/**
 * delete all instructions
 * route:					/instructions
 * method type: 	DELETE
 */
router.del('/', async (ctx) => {
	await controller.deleteInstructions(ctx);
});

/**
 * delete a specific instruction
 * route:					/instructions/:id
 * method type: 	DELETE
 */
router.del('/:id', async (ctx) => {
	await controller.deleteInstructionById(ctx);
});


module.exports = router;
