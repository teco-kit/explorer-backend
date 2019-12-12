const mongoose = require('mongoose');

const Instruction = new mongoose.Schema({
	name: {
		type: String,
		required: [true, 'please enter an instruction name']
	},
	color: {
		type: String
	}
});

module.exports = {
	model: mongoose.model('Instruction', Instruction),
	schema: Instruction
};
