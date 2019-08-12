const mongoose = require('mongoose');

const Sensor = new mongoose.Schema({
	name: {
		type: String,
		required: [true, 'sensorType name cannot be empty']
	}
});

module.exports = {
	model: mongoose.model('Sensor', Sensor),
	schema: Sensor
};
