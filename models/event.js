const mongoose = require('mongoose');

const Event = new mongoose.Schema({
	name: {
		type: String,
		required: [true, 'event name cannot be empty']
	},
	type: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'EventType'
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
	model: mongoose.model('Event', Event),
	schema: Event
};
