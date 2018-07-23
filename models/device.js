const mongoose = require('mongoose');

const Device = new mongoose.Schema({
	uuid: String,
	firmware: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Firmware'
	},
});

module.exports = {
	model: mongoose.model('Device', Device),
	schema: Device,
};
