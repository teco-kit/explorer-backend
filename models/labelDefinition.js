const mongoose = require('mongoose');

const LabelDefinition = new mongoose.Schema({
	instructions: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Instructions '
	}],
	name: {
		type: String
	}
});

module.exports = {
	model: mongoose.model('LabelDefinition', LabelDefinition),
	schema: LabelDefinition
};
