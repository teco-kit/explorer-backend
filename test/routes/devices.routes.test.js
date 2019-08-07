const supertest = require('supertest');
const mongoose = require('mongoose');
const chai = require('chai');

const server = require('../../server.js');
const Device = require('./../../models/device').model;

const {expect} = chai;
const request = supertest(server);

function testDevice() {
	before('drop collections', (done) => {
		mongoose.connection.db.dropDatabase();
		done();
	});

	describe('GET /devices', () => {
		it('returns status 404 when no devices found', (done) => {
			request.get('/devices')
				.expect(404)
				.end((err, res) => {
					expect(res.body.error)
						.to.be.equal(`no devices found`);
					done(err);
				});
		});
	});

	// test route create device
	describe('POST /devices', () => {
		// get firmware id
		// create a new firmware with a valid dummy
		it('saves a new firmware', (done) => {
			request.post('/firmware')
				.send(require('./../dummy/firmware').dummy1)
				.expect(201)
				.end((err, res) => {
					done(err);
				});
		});
		// get user id
		// create a new user with a valid dummy
		it('saves a new user', (done) => {
			request.post('/users')
				.send(require('./../dummy/user').dummy1)
				.expect(201)
				.end((err, res) => {
					done(err);
				});
		});
		it('saves a new device', (done) => {
			request.get('/firmware')
				.expect(200)
				.end((err, res) => {
					const dummy = require('./../dummy/device').dummy1;
					dummy.firmware = res.body[0]._id;
					request.get('/users')
						.expect(200)
						.end((err2, res2) => {
							dummy.user = res.body[0]._id;
							request.post('/devices')
								.send(dummy)
								.expect(201)
								.end((err3, res3) => {
									done(err3);
								});
						});
				});
		});

		// creating a device with an invalid dummy should not be possible
		it('returns status 500 when object format wrong', (done) => {
			request.post('/devices')
				.send(require('./../dummy/device').invalidDummy)
				.expect(500)
				.end((err, res) => {
					done(err);
				});
		});
	});

	// test route create device by id
	describe('POST /devices/:id', () => {
		// it is not allowed to create a device for a given id
		it('creating a device with id is not allowed', (done) => {
			request.post('/devices/5d1241f1adc318414d007d73')
				.send(require('./../dummy/device').dummy1)
				.expect(500)
				.end((err, res) => {
					expect(res.body.error)
						.to.be.equal('Method Not Allowed');
					done(err);
				});
		});
	});

	// test route get devices
	describe('GET /devices', () => {
		// should now return the device created above
		it('returns a list of devices', (done) => {
			request.get('/devices')
				.expect(200)
				.end((err, res) => {
					expect(res.body)
						.to.be.an('array');
					done(err);
				});
		});
	});

	// test route get device by id
	describe('GET /devices/:id', () => {
		// retrieve id of created device and get device by id
		it('returns a device by id', (done) => {
			Device.findOne({}, (error, docs) => {
				if (error) {
					done(error);
				} else {
					request.get(`/devices/${docs._id}`)
						.expect(200)
						.end((err, res) => {
							expect(res.body)
								.to.have.all.keys('_id', 'sensors', 'deviceId',
									'firmware', 'generation', 'user', '__v');
							done(err);
						});
				}
			});
		});

		// get device with invalid id should return 404
		it('returns status 404 when id is not found', (done) => {
			request.get('/devices/5d123d130ea6be3a976d375d')
				.expect(404)
				.end((err, res) => {
					expect(res.body.error)
						.to.be.equal(`device with id '5d123d130ea6be3a976d375d' not found`);
					done(err);
				});
		});
	});

	// test route update devices
	describe('PUT /devices', () => {
		// should return 501 since not implemented yet
		it('update a list of devices is not implemented yet', (done) => {
			request.put('/devices')
				.expect(501)
				.end((err, res) => {
					expect(res.body.error)
						.to.be.equal('Not Implemented');
					done(err);
				});
		});
	});

	// test route update device by id
	describe('PUT /devices/:id', () => {
		// update device by id with a dummy
		it('update a device by id', (done) => {
			Device.findOne({}, (error, docs) => {
				if (error) {
					done(error);
				} else {
					request.get('/firmware')
						.expect(200)
						.end((err, res) => {
							const dummy = require('./../dummy/device').dummy2;
							dummy.firmware = res.body[0]._id;
							request.get('/users')
								.expect(200)
								.end((err2, res2) => {
									dummy.user = res.body[0]._id;
									request.put(`/devices/${docs._id}`)
										.send(dummy)
										.expect(200)
										.end((err3, res3) => {
											expect(res3.body.message)
												.to.be.equal(`updated device with id: ${docs._id}`);
											done(err);
										});
								});
						});
				}
			});
		});

		// update device with invalid id should return 404
		it('returns status 404 when id is not found', (done) => {
			request.get('/devices/5d123d130ea6be3a976d375d')
				.expect(404)
				.end((err, res) => {
					expect(res.body.error)
						.to.be.equal(`device with id '5d123d130ea6be3a976d375d' not found`);
					done(err);
				});
		});
	});

	// test route delete device by id
	describe('DELETE /devices/:id', () => {
		it('delete a device by id', (done) => {
			Device.findOne({}, (error, docs) => {
				if (error) {
					done(error);
				} else {
					request.delete(`/devices/${docs._id}`)
						.expect(200)
						.end((err, res) => {
							expect(res.body.message)
								.to.be.equal(`deleted device with id: ${docs._id}`);
							done(err);
						});
				}
			});
		});

		// delete device with invalid id should return 404
		it('returns status 404 when id is not found', (done) => {
			request.get('/devices/5d123d130ea6be3a976d375d')
				.expect(404)
				.end((err, res) => {
					expect(res.body.error)
						.to.be.equal(`device with id '5d123d130ea6be3a976d375d' not found`);
					done(err);
				});
		});
	});

	// test route delete devices
	describe('DELETE /devices', () => {
		// create two more devices
		// so we have at least two devices in db for testing multiple deletion
		it('create first device dummy to delete multiple devices', (done) => {
			request.post('/devices')
				.send(require('./../dummy/device').dummy1)
				.expect(201)
				.end((err, res) => {
					done(err);
				});
		});
		it('create second device dummy to delete multiple devices', (done) => {
			request.post('/devices')
				.send(require('./../dummy/device').dummy2)
				.expect(201)
				.end((err, res) => {
					done(err);
				});
		});

		// now delete all devices
		it('delete all devices', (done) => {
			request.delete(`/devices`)
				.expect(200)
				.end((err, res) => {
					expect(res.body.message)
						.to.be.equal(`deleted all devices`);
					done(err);
				});
		});

		// since we just deleted all devices, get devices should return 404
		it('should 404 since we just deleted all devices', (done) => {
			request.get('/devices')
				.expect(404)
				.end((err, res) => {
					expect(res.body.error)
						.to.be.equal(`no devices found`);
					done(err);
				});
		});

		// delete firmware
		// now delete all firmware
		it('delete all firmware', (done) => {
			request.delete(`/firmware`)
				.expect(200)
				.end((err, res) => {
					expect(res.body.message)
						.to.be.equal(`deleted all firmware`);
					done(err);
				});
		});

		// since we just deleted all firmware, get firmware should return 404
		it('should 404 since we just deleted all firmware', (done) => {
			request.get('/firmware')
				.expect(404)
				.end((err, res) => {
					expect(res.body.error)
						.to.be.equal(`no firmware found`);
					done(err);
				});
		});

		// delete users
		// now delete all users
		it('delete all users', (done) => {
			request.delete(`/users`)
				.expect(200)
				.end((err, res) => {
					expect(res.body.message)
						.to.be.equal(`deleted all users`);
					done(err);
				});
		});

		// since we just deleted all users, get users should return 404
		it('should 404 since we just deleted all users', (done) => {
			request.get('/users')
				.expect(404)
				.end((err, res) => {
					expect(res.body.error)
						.to.be.equal(`no users found`);
					done(err);
				});
		});


	});
}

module.exports = testDevice;
