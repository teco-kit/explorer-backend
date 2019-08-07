const mongoose = require('mongoose');

const TimeSeriesData = new mongoose.Schema({
	timestamp: {
		type: Number,
		required: [true, 'TimeSeriesData timestamp cannot be empty']
	},
	value: {
		type: Number,
		required: [true, 'TimeSeriesData value cannot be empty']
	}
});

module.exports = {
	model: mongoose.model('TimeSeriesData', TimeSeriesData),
	schema: TimeSeriesData
};
