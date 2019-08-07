const mongoose = require('mongoose');
const Label = require('./label').schema;


const LabelingObject = new mongoose.Schema({
	labelingId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Labeling'
	},
	labels: {
		type: [Label],
		default: []
	},
	creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service'
  }
});

module.exports = {
	model: mongoose.model('LabelingObject', LabelingObject),
	schema: LabelingObject
};
