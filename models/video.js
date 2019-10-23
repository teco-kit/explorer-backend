const mongoose = require('mongoose');

const Video = new mongoose.Schema({
	url: {
		type: String
	},
	offset: {
		type: Number
	}
});

module.exports = {
	model: mongoose.model('Video', Video),
	schema: Video
};
