const mongoose = require('mongoose');

const Label = new mongoose.Schema({
	name: {
		type: String,
		required: [true, 'please enter a label name']
	},
	color: {
		type: String
	}
});

module.exports = {
	model: mongoose.model('Label', Label),
	schema: Label
};
