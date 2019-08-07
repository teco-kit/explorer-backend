const mongoose = require('mongoose');

const Result = new mongoose.Schema({
	name: {
		type: String,
		required: [true, 'result name cannot be empty']
	},
	value: Number,
	text: String
});

module.exports = {
	model: mongoose.model('Result', Result),
	schema: Result
};
