const supertest = require('supertest');
const mongoose = require('mongoose');
const chai = require('chai');

const server = require('../../server.js');
const Service = require('./../../models/service').model;

const {expect} = chai;
const request = supertest(server);

function testService() {
	before('drop collections', (done) => {
		mongoose.connection.db.dropDatabase();
		done();
	});

	// service collection should now be empty
	describe('GET /services', () => {
		it('returns status 404 when no services found', (done) => {
			request.get('/services')
				.expect(404)
				.end((err, res) => {
					expect(res.body.error)
						.to.be.equal(`no services found`);
					done(err);
				});
		});
	});

	// test route create service
	describe('POST /services', () => {
		// create a new service with a valid dummy
		it('saves a new service', (done) => {
			request.post('/services')
				.send(require('./../dummy/service').dummy1)
				.expect(201)
				.end((err, res) => {
					done(err);
				});
		});

		// creating a service with an invalid dummy should not be possible
		it('returns status 500 when object format wrong', (done) => {
			request.post('/services')
				.send(require('./../dummy/service').invalidDummy)
				.expect(500)
				.end((err, res) => {
					done(err);
				});
		});
	});

	// test route create service by id
	describe('POST /services/:id', () => {
		// it is not allowed to create a service for a given id
		it('creating a service with id is not allowed', (done) => {
			request.post('/services/5d1241f1adc318414d007d73')
				.send(require('./../dummy/service').dummy1)
				.expect(500)
				.end((err, res) => {
					expect(res.body.error)
						.to.be.equal('Method Not Allowed');
					done(err);
				});
		});
	});

	// test route get services
	describe('GET /services', () => {
		// should now return the service created above
		it('returns a list of services', (done) => {
			request.get('/services')
				.expect(200)
				.end((err, res) => {
					expect(res.body)
						.to.be.an('array');
					done(err);
				});
		});
	});

	// test route get service by id
	describe('GET /services/:id', () => {
		// retrieve id of created service and get service by id
		it('returns a service by id', (done) => {
			Service.findOne({}, (error, docs) => {
				if (error) {
					done(error);
				} else {
					request.get(`/services/${docs._id}`)
						.expect(200)
						.end((err, res) => {
							expect(res.body)
								.to.have.all.keys('_id', 'name', 'version', '__v');
							done(err);
						});
				}
			});
		});

		// get service with invalid id should return 404
		it('returns status 404 when id is not found', (done) => {
			request.get('/services/5d123d130ea6be3a976d375d')
				.expect(404)
				.end((err, res) => {
					expect(res.body.error)
						.to.be.equal(`service with id '5d123d130ea6be3a976d375d' not found`);
					done(err);
				});
		});
	});

	// test route update services
	describe('PUT /services', () => {
		// should return 501 since not implemented yet
		it('update a list of services is not implemented yet', (done) => {
			request.put('/services')
				.expect(501)
				.end((err, res) => {
					expect(res.body.error)
						.to.be.equal('Not Implemented');
					done(err);
				});
		});
	});

	// test route update service by id
	describe('PUT /services/:id', () => {
		// update service by id with a dummy
		it('update a service by id', (done) => {
			Service.findOne({}, (error, docs) => {
				if (error) {
					done(error);
				} else {
					request.put(`/services/${docs._id}`)
						.send(require('./../dummy/service').dummy2)
						.expect(200)
						.end((err, res) => {
							expect(res.body.message)
								.to.be.equal(`updated service with id: ${docs._id}`);
							done(err);
						});
				}
			});
		});

		// update service with invalid id should return 404
		it('returns status 404 when id is not found', (done) => {
			request.get('/services/5d123d130ea6be3a976d375d')
				.expect(404)
				.end((err, res) => {
					expect(res.body.error)
						.to.be.equal(`service with id '5d123d130ea6be3a976d375d' not found`);
					done(err);
				});
		});
	});

	// test route delete service by id
	describe('DELETE /services/:id', () => {
		it('delete a service by id', (done) => {
			Service.findOne({}, (error, docs) => {
				if (error) {
					done(error);
				} else {
					request.delete(`/services/${docs._id}`)
						.expect(200)
						.end((err, res) => {
							expect(res.body.message)
								.to.be.equal(`deleted service with id: ${docs._id}`);
							done(err);
						});
				}
			});
		});

		// delete service with invalid id should return 404
		it('returns status 404 when id is not found', (done) => {
			request.get('/services/5d123d130ea6be3a976d375d')
				.expect(404)
				.end((err, res) => {
					expect(res.body.error)
						.to.be.equal(`service with id '5d123d130ea6be3a976d375d' not found`);
					done(err);
				});
		});
	});

	// test route delete services
	describe('DELETE /services', () => {
		// create two more services
		// so we have at least two services in db for testing multiple deletion
		it('create first service dummy to delete multiple services', (done) => {
			request.post('/services')
				.send(require('./../dummy/service').dummy1)
				.expect(201)
				.end((err, res) => {
					done(err);
				});
		});
		it('create second service dummy to delete multiple services', (done) => {
			request.post('/services')
				.send(require('./../dummy/service').dummy2)
				.expect(201)
				.end((err, res) => {
					done(err);
				});
		});

		// now delete all services
		it('delete all services', (done) => {
			request.delete(`/services`)
				.expect(200)
				.end((err, res) => {
					expect(res.body.message)
						.to.be.equal(`deleted all services`);
					done(err);
				});
		});

		// since we just deleted all services, get services should return 404
		it('should 404 since we just deleted all services', (done) => {
			request.get('/services')
				.expect(404)
				.end((err, res) => {
					expect(res.body.error)
						.to.be.equal(`no services found`);
					done(err);
				});
		});
	});
}

module.exports = testService;
