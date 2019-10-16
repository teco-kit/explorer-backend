const mongoose = require('mongoose');

const User = new mongoose.Schema({
	sex: {
		type: String,
		enum: ['m', 'f', 'd']
	},
	birthday: {
		type: Date,
	},
	weight: {
		type: Number,
	},
	platform: {
		type: String,
		enum: ['android', 'ios', 'windows'],
	},
	clientVersion: Number,
	authId: {
		type: String,
		required: [true, 'cannot create user without authId']
	}
});

module.exports = {
	model: mongoose.model('User', User),
	schema: User
};
