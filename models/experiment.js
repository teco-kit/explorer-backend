const mongoose = require('mongoose');

const Experiment = new mongoose.Schema({
	name: {
		type: String,
		required: [true, 'experiment name cannot be empty']
	},
  instructions: Array
});

module.exports = {
	model: mongoose.model('Experiment', Experiment),
	schema: Experiment
};
