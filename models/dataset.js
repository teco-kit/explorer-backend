const mongoose = require('mongoose');

const Dataset = new mongoose.Schema({
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
