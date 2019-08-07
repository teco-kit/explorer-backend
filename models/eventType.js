const mongoose = require('mongoose');

const EventType = new mongoose.Schema({
	name: {
		type: String,
		required: [true, 'eventType name cannot be empty']
	}
});

module.exports = {
	model: mongoose.model('EventType', EventType),
	schema: EventType
};
