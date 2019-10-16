const mongoose = require('mongoose');

const LabelType = new mongoose.Schema({
	name: {
		type: String,
		required: [true, 'please enter a labelType name']
	},
	color: {
		type: String
	}
});

module.exports = {
	model: mongoose.model('LabelType', LabelType),
	schema: LabelType
};
