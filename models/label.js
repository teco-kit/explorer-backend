const mongoose = require('mongoose');

const Label = new mongoose.Schema({
	name: {
		type: String,
		required: [true, 'please enter a label name']
	},
	type: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'LabelType'
	},
	start: {
		type: Number,
		required: [true, 'event value cannot be empty']
	},
	end: {
		type: Number,
		required: [true, 'event value cannot be empty']
	}
});

module.exports = {
	model: mongoose.model('Label', Label),
	schema: Label
};
