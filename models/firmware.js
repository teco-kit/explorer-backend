const mongoose = require('mongoose');

const Firmware = new mongoose.Schema({
	version: {
		type: String,
		required: true
	},
	binary: {
		type: Buffer,
		required: true
	},
	hash: {
		type: String,
		required: true
	},
	supportedDevices: [{
		type: Number,
		required: [true, 'supportedDevices cannot be empty']
	}],
	uploadedAt: {
		type: Date,
		default: Date.now
	},
});

module.exports = {
	model: mongoose.model('Firmware', Firmware),
	schema: Firmware,
};
