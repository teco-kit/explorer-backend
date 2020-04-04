const mongoose = require('mongoose');

const Experiment = new mongoose.Schema({
	name: {
		type: String,
		required: [true, 'experiment name cannot be empty']
	},
	instructions: [{
		duration: {
			type: String,
			required: [true, 'please define a duration']
		},
		labelingId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'LabelDefinition',
			required: [true, 'instruction objects needs to be associated with LabelDefinition']
		},
		labelType: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'LabelType',
			required: [true, 'instruction objects needs to be associated with LabelType']
		}
	}]
});

module.exports = {
	model: mongoose.model('Experiment', Experiment),
	schema: Experiment
};
