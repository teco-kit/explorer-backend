const supertest = require('supertest');
const mongoose = require('mongoose');
const chai = require('chai');

const server = require('../../server.js');
const User = require('./../../models/firmware').model;

const {expect} = chai;
const request = supertest(server);

function testUser() {
	before('drop collections', (done) => {
		mongoose.connection.db.dropDatabase();
		done();
	});
	// firmware collection should now be empty
	describe('GET /firmware', () => {
		it('returns status 404 when no firmware found', (done) => {
			request.get('/firmware')
				.expect(404)
				.end((err, res) => {
					expect(res.body.error)
						.to.be.equal(`no firmware found`);
					done(err);
				});
		});
	});

	// test route create firmware
	describe('POST /firmware', () => {
		// create a new firmware with a valid dummy
		it('saves a new firmware', (done) => {
			request.post('/firmware')
				.send(require('./../dummy/firmware').dummy1)
				.expect(201)
				.end((err, res) => {
					done(err);
				});
		});

		// creating a firmware with an invalid dummy should not be possible
		it('returns status 500 when object format wrong', (done) => {
			request.post('/firmware')
				.send(require('./../dummy/firmware').invalidDummy)
				.expect(500)
				.end((err, res) => {
					done(err);
				});
		});
	});

	// test route create firmware by id
	describe('POST /firmware/:id', () => {
		// it is not allowed to create a firmware for a given id
		it('creating a firmware with id is not allowed', (done) => {
			request.post('/firmware/5d1241f1adc318414d007d73')
				.send(require('./../dummy/firmware').dummy1)
				.expect(500)
				.end((err, res) => {
					expect(res.body.error)
						.to.be.equal('Method Not Allowed');
					done(err);
				});
		});
	});

	// test route get firmware
	describe('GET /firmware', () => {
		// should now return the firmware created above
		it('returns a list of firmware', (done) => {
			request.get('/firmware')
				.expect(200)
				.end((err, res) => {
					expect(res.body.data)
						.to.be.an('array');
					done(err);
				});
		});
	});

	// test route get firmware by id
	describe('GET /firmware/:id', () => {
		// retrieve id of created firmware and get firmware by id
		it('returns a firmware by id', (done) => {
			User.findOne({}, (error, docs) => {
				if (error) {
					done(error);
				} else {
					request.get(`/firmware/${docs._id}`)
						.expect(200)
						.end((err, res) => {
							expect(res.body.data)
								.to.have.all.keys('_id', 'version', 'binary', 'hash',
									'supportedDevices', 'uploadedAt', '__v');
							done(err);
						});
				}
			});
		});

		// get firmware with invalid id should return 404
		it('returns status 404 when id is not found', (done) => {
			request.get('/firmware/5d123d130ea6be3a976d375d')
				.expect(404)
				.end((err, res) => {
					expect(res.body.error)
						.to.be.equal(`firmware with id '5d123d130ea6be3a976d375d' not found`);
					done(err);
				});
		});
	});

	// test route update firmware
	describe('PUT /firmware', () => {
		// should return 501 since not implemented yet
		it('update a list of firmware is not implemented yet', (done) => {
			request.put('/firmware')
				.expect(501)
				.end((err, res) => {
					expect(res.body.error)
						.to.be.equal('Not Implemented');
					done(err);
				});
		});
	});

	// test route update firmware by id
	describe('PUT /firmware/:id', () => {
		// update firmware by id with a dummy
		it('update a firmware by id', (done) => {
			User.findOne({}, (error, docs) => {
				if (error) {
					done(error);
				} else {
					request.put(`/firmware/${docs._id}`)
						.send(require('./../dummy/firmware').dummy2)
						.expect(200)
						.end((err, res) => {
							expect(res.body.message)
								.to.be.equal(`updated firmware with id: ${docs._id}`);
							done(err);
						});
				}
			});
		});

		// update firmware with invalid id should return 404
		it('returns status 404 when id is not found', (done) => {
			request.get('/firmware/5d123d130ea6be3a976d375d')
				.expect(404)
				.end((err, res) => {
					expect(res.body.error)
						.to.be.equal(`firmware with id '5d123d130ea6be3a976d375d' not found`);
					done(err);
				});
		});
	});

	// test route delete firmware by id
	describe('DELETE /firmware/:id', () => {
		it('delete a firmware by id', (done) => {
			User.findOne({}, (error, docs) => {
				if (error) {
					done(error);
				} else {
					request.delete(`/firmware/${docs._id}`)
						.expect(200)
						.end((err, res) => {
							expect(res.body.message)
								.to.be.equal(`deleted firmware with id: ${docs._id}`);
							done(err);
						});
				}
			});
		});

		// delete firmware with invalid id should return 404
		it('returns status 404 when id is not found', (done) => {
			request.get('/firmware/5d123d130ea6be3a976d375d')
				.expect(404)
				.end((err, res) => {
					expect(res.body.error)
						.to.be.equal(`firmware with id '5d123d130ea6be3a976d375d' not found`);
					done(err);
				});
		});
	});

	// test route delete firmware
	describe('DELETE /firmware', () => {
		// create two more firmware
		// so we have at least two firmware in db for testing multiple deletion
		it('create first firmware dummy to delete multiple firmware', (done) => {
			request.post('/firmware')
				.send(require('./../dummy/firmware').dummy1)
				.expect(201)
				.end((err, res) => {
					done(err);
				});
		});
		it('create second firmware dummy to delete multiple firmware', (done) => {
			request.post('/firmware')
				.send(require('./../dummy/firmware').dummy2)
				.expect(201)
				.end((err, res) => {
					done(err);
				});
		});

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
	});
}

module.exports = testUser;
