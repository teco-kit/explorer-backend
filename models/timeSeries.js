const mongoose = require('mongoose');

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
		type: [{"timestamp":Number, "datapoint": Number}]
	},
	offset: {
		type: Number,
		default: 0
	},
	start: Number,
	end: Number,
	samplingRate: Number
});

module.exports = {
	model: mongoose.model('TimeSeries', TimeSeries),
	schema: TimeSeries
};
