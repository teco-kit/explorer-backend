const mongoose = require('mongoose');
const findOrCreate = require('mongoose-findorcreate');

const User = new mongoose.Schema({
	sub: String,
	nickname: String,
	created_at: {
		type: Date,
		required: true,
		default: Date.now
	},
	platform: {
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

User.plugin(findOrCreate);

module.exports = {
	model: mongoose.model('User', User),
	schema: User,
};
