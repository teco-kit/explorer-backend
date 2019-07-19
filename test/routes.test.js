const mongoose = require('mongoose');
const Config       = require('config');

const config = Config.get('server');

// get tests for routes
const userTest = require('./routes/users.routes.test');
const serviceTest = require('./routes/services.routes.test');
const firmwareTest = require('./routes/firmware.routes.test');
const sensorTest = require('./routes/sensors.routes.test');
const eventTest = require('./routes/events.routes.test');
const labelTest = require('./routes/labels.routes.test');
const labelingTest = require('./routes/labelings.routes.test');
const deviceTest = require('./routes/devices.routes.test');
const datasetTest = require('./routes/datasets.routes.test');
const videoTest = require('./routes/subroutes/video.routes.test');

describe('Testing API Routes', () => {
	before('check connection', (done) => {
		mongoose.connection.on('connected', () => {
			done();
		});
	});

	// Testing Routes
	describe('user routes', userTest.bind(this));
	describe('service routes', serviceTest.bind(this));
	describe('firmware routes', firmwareTest.bind(this));
	describe('sensor routes', sensorTest.bind(this));
	describe('event routes', eventTest.bind(this));
	describe('label routes', labelTest.bind(this));
	describe('labeling routes', labelingTest.bind(this));
	describe('devices routes', deviceTest.bind(this));
	describe('datasets routes', datasetTest.bind(this));
	describe('video routes', videoTest.bind(this));
});

module.exports = mongoose;
