const mongoose = require('mongoose');

const Dataset = new mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},
	startTime: Date,
	samples: Number,
	data: [
		{
			delta: Number,
			value: Number,
		}
	],
});

module.exports = {
	model: mongoose.model('Dataset', Dataset),
	schema: Dataset,
};
