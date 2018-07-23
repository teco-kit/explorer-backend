const mongoose = require('mongoose');

const Firmware = new mongoose.Schema({
	version: String,
	binary: Buffer,
	hash: String,
});

module.exports = {
	model: mongoose.model('Firmware', Firmware),
	schema: Firmware,
};
