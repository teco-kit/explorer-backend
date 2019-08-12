const mongoose = require('mongoose');

const Labeling = new mongoose.Schema({
	labels: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'LabelType'
	}]
});

module.exports = {
	model: mongoose.model('Labeling', Labeling),
	schema: Labeling
};
