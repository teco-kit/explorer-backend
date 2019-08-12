const mongoose = require('mongoose');

const DatasetEvent = new mongoose.Schema({
	name: {
		type: String,
		required: [true, 'event name cannot be empty']
	},
	type: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Event'
	},
	value: {
		type: Number,
		required: [true, 'event value cannot be empty']
	},
	time: {
		type: Number,
		required: [true, 'event value cannot be empty']
	},
	unit: String,
	icon: {
		type: Number,
		default: ''
	}
});

module.exports = {
	model: mongoose.model('DatasetEvent', DatasetEvent),
	schema: DatasetEvent
};
