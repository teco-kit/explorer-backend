const supertest = require('supertest');
const mongoose = require('mongoose');
const chai = require('chai');

const server = require('../../server.js');
const Sensor = require('./../../models/sensorType').model;

const {expect} = chai;
const request = supertest(server);

function testSensor() {
	before('drop collections', (done) => {
		mongoose.connection.db.dropDatabase();
		done();
	});

	// sensor collection should now be empty
	describe('GET /sensors', () => {
		it('returns status 404 when no sensors found', (done) => {
			request.get('/sensors')
				.expect(404)
				.end((err, res) => {
					expect(res.body.error)
						.to.be.equal(`no sensors found`);
					done(err);
				});
		});
	});

	// test route create sensor
	describe('POST /sensors', () => {
		// create a new sensor with a valid dummy
		it('saves a new sensor', (done) => {
			request.post('/sensors')
				.send(require('./../dummy/sensor').dummy1)
				.expect(201)
				.end((err, res) => {
					done(err);
				});
		});

		// creating a sensor with an invalid dummy should not be possible
		it('returns status 500 when object format wrong', (done) => {
			request.post('/sensors')
				.send(require('./../dummy/sensor').invalidDummy)
				.expect(500)
				.end((err, res) => {
					done(err);
				});
		});
	});

	// test route create sensor by id
	describe('POST /sensors/:id', () => {
		// it is not allowed to create a sensor for a given id
		it('creating a sensor with id is not allowed', (done) => {
			request.post('/sensors/5d1241f1adc318414d007d73')
				.send(require('./../dummy/sensor').dummy1)
				.expect(500)
				.end((err, res) => {
					expect(res.body.error)
						.to.be.equal('Method Not Allowed');
					done(err);
				});
		});
	});

	// test route get sensors
	describe('GET /sensors', () => {
		// should now return the sensor created above
		it('returns a list of sensors', (done) => {
			request.get('/sensors')
				.expect(200)
				.end((err, res) => {
					expect(res.body.data)
						.to.be.an('array');
					done(err);
				});
		});
	});

	// test route get sensor by id
	describe('GET /sensors/:id', () => {
		// retrieve id of created sensor and get sensor by id
		it('returns a sensor by id', (done) => {
			Sensor.findOne({}, (error, docs) => {
				if (error) {
					done(error);
				} else {
					request.get(`/sensors/${docs._id}`)
						.expect(200)
						.end((err, res) => {
							expect(res.body.data)
								.to.have.all.keys('_id', 'name', '__v');
							done(err);
						});
				}
			});
		});

		// get sensor with invalid id should return 404
		it('returns status 404 when id is not found', (done) => {
			request.get('/sensors/5d123d130ea6be3a976d375d')
				.expect(404)
				.end((err, res) => {
					expect(res.body.error)
						.to.be.equal(`sensor with id '5d123d130ea6be3a976d375d' not found`);
					done(err);
				});
		});
	});

	// test route update sensors
	describe('PUT /sensors', () => {
		// should return 501 since not implemented yet
		it('update a list of sensors is not implemented yet', (done) => {
			request.put('/sensors')
				.expect(501)
				.end((err, res) => {
					expect(res.body.error)
						.to.be.equal('Not Implemented');
					done(err);
				});
		});
	});

	// test route update sensor by id
	describe('PUT /sensors/:id', () => {
		// update sensor by id with a dummy
		it('update a sensor by id', (done) => {
			Sensor.findOne({}, (error, docs) => {
				if (error) {
					done(error);
				} else {
					request.put(`/sensors/${docs._id}`)
						.send(require('./../dummy/sensor').dummy2)
						.expect(200)
						.end((err, res) => {
							expect(res.body.message)
								.to.be.equal(`updated sensor with id: ${docs._id}`);
							done(err);
						});
				}
			});
		});

		// update sensor with invalid id should return 404
		it('returns status 404 when id is not found', (done) => {
			request.get('/sensors/5d123d130ea6be3a976d375d')
				.expect(404)
				.end((err, res) => {
					expect(res.body.error)
						.to.be.equal(`sensor with id '5d123d130ea6be3a976d375d' not found`);
					done(err);
				});
		});
	});

	// test route delete sensor by id
	describe('DELETE /sensors/:id', () => {
		it('delete a sensor by id', (done) => {
			Sensor.findOne({}, (error, docs) => {
				if (error) {
					done(error);
				} else {
					request.delete(`/sensors/${docs._id}`)
						.expect(200)
						.end((err, res) => {
							expect(res.body.message)
								.to.be.equal(`deleted sensor with id: ${docs._id}`);
							done(err);
						});
				}
			});
		});

		// delete sensor with invalid id should return 404
		it('returns status 404 when id is not found', (done) => {
			request.get('/sensors/5d123d130ea6be3a976d375d')
				.expect(404)
				.end((err, res) => {
					expect(res.body.error)
						.to.be.equal(`sensor with id '5d123d130ea6be3a976d375d' not found`);
					done(err);
				});
		});
	});

	// test route delete sensors
	describe('DELETE /sensors', () => {
		// create two more sensors
		// so we have at least two sensors in db for testing multiple deletion
		it('create first sensor dummy to delete multiple sensors', (done) => {
			request.post('/sensors')
				.send(require('./../dummy/sensor').dummy1)
				.expect(201)
				.end((err, res) => {
					done(err);
				});
		});
		it('create second sensor dummy to delete multiple sensors', (done) => {
			request.post('/sensors')
				.send(require('./../dummy/sensor').dummy2)
				.expect(201)
				.end((err, res) => {
					done(err);
				});
		});

		// now delete all sensors
		it('delete all sensors', (done) => {
			request.delete(`/sensors`)
				.expect(200)
				.end((err, res) => {
					expect(res.body.message)
						.to.be.equal(`deleted all sensors`);
					done(err);
				});
		});

		// since we just deleted all sensors, get sensors should return 404
		it('should 404 since we just deleted all sensors', (done) => {
			request.get('/sensors')
				.expect(404)
				.end((err, res) => {
					expect(res.body.error)
						.to.be.equal(`no sensors found`);
					done(err);
				});
		});
	});
}

module.exports = testSensor;
