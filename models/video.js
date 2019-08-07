const mongoose = require('mongoose');

const Video = new mongoose.Schema({
	url: {
		type: String,
		default: ''
	},
	offset: {
		type: Number,
		default: 0
	}
});

module.exports = {
	model: mongoose.model('Video', Video),
	schema: Video
};
