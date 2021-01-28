const mongoose = require('mongoose');
const timePoint = require('./timePoint').schema;

const TimeSeries = new mongoose.Schema({
	name: {
		type: String,
		required: [true, 'timeSeries name cannot be empty']
	},
	unit: {
		type: String,
		default: ''
	},
	data: {
		type: [timePoint],
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
