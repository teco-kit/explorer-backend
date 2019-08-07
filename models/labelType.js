const mongoose = require('mongoose');

const LabelType = new mongoose.Schema({
	name: {
		type: String,
		required: [true, 'please enter a label name']
	}
});

module.exports = {
	model: mongoose.model('LabelType', LabelType),
	schema: LabelType
};
