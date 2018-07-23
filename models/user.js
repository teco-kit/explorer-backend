const mongoose = require('mongoose');

const User = new mongoose.Schema({
	username: String,
	created_at: {
		type: Date,
		required: true,
		default: Date.now
	},
	plattform: {
		type: String,
		enum: ['Android', 'iOS', 'Windows'],
	},
	client_version: Number,
	last_seen: Date,
	device: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Device'
	},
});

module.exports = {
	model: mongoose.model('User', User),
	schema: User,
};
