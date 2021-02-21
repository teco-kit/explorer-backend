const mongoose = require('mongoose');

const Device = new mongoose.Schema({
	deviceId: {
		type: Number,
		required: [true, 'deviceId cannot be empty'],
	},
	firmware: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Firmware',
		required: [true, 'firmware cannot be empty'],
	},
	sensors: { type: [mongoose.Schema.Types.ObjectId], ref: 'Sensor' },
	generation: {
		type: Number,
		required: [true, 'generation cannot be empty'],
	},
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
	},
});

module.exports = {
	model: mongoose.model('Device', Device),
	schema: Device,
};
