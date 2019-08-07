const mongoose = require('mongoose');

const Service = new mongoose.Schema({
	name: {
		type: String,
		required: [true, 'service name cannot be empty']
	},
  version: {
    type: Number,
    required: [true, 'version cannot be empty']
  }
});

module.exports = {
	model: mongoose.model('Service', Service),
	schema: Service
};
