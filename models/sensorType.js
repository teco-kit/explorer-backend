const mongoose = require('mongoose');

const SensorType = new mongoose.Schema({
	name: {
		type: String,
		required: [true, 'sensorType name cannot be empty']
	}
});

module.exports = {
	model: mongoose.model('SensorType', SensorType),
	schema: SensorType
};
