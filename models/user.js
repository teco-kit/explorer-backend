const mongoose = require('mongoose');

const User = new mongoose.Schema({
	sex: {
		type: String,
		required: [true, 'please enter your sex'],
		enum: ['m', 'f', 'd']
	},
	birthday: {
		type: Date,
		required: [true, 'please enter your birthday']
	},
	weight: {
		type: Number,
		min: [30, 'please enter a valid weight']
	},
	platform: {
		type: String,
		enum: ['android', 'ios', 'windows'],
	},
	clientVersion: Number
});

module.exports = {
	model: mongoose.model('User', User),
	schema: User
};
