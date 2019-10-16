const mongoose = require('mongoose');

const Event = new mongoose.Schema({
	name: {
		type: String,
		required: [true, 'eventType name cannot be empty']
	}
});

module.exports = {
	model: mongoose.model('Event', Event),
	schema: Event
};
