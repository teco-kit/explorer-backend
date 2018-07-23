const mongoose = require('mongoose');

const Analysis = new mongoose.Schema({
	dataset: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Dataset'
	},
	result: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Result'
	},
	meta: {
		queued_at: {
			type: Date,
			required: true,
			default: Date.now,
		},
		finished_at: {
			type: Date,
			required: false,
		},
	},
	state: {
		type: String,
		enum: ['queued', 'processing', 'done'],
	},
});

module.exports = {
	model: mongoose.model('Analysis', Analysis),
	schema: Analysis,
};
