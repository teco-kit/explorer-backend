const mongoose = require('mongoose');

const TimeSeriesData = require('./timeSeriesData').schema;

const TimeSeries = new mongoose.Schema({
	name: {
		type: String,
		required: [true, 'timeSeries name cannot be empty']
	},
	unit: {
		type: String,
		required: [true, 'timeSeries unit cannot be empty']
	},
	data: {
		type: [TimeSeriesData],
		default: []
	},
	offset: {
		type: Number,
		default: 0
	}
});

module.exports = {
	model: mongoose.model('TimeSeries', TimeSeries),
	schema: TimeSeries
};
