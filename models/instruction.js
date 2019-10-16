const mongoose = require('mongoose');

const Instruction = new mongoose.Schema({
	name: {
		type: String,
		required: [true, 'instruction name cannot be empty']
	},
	labels: Array
});

module.exports = {
	model: mongoose.model('Instruction', Instruction),
	schema: Instruction
};
