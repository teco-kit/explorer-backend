const supertest = require('supertest');
const mongoose = require('mongoose');
const chai = require('chai');

const server = require('../../server.js');
const Dataset = require('./../../models/dataset').model;

const {expect} = chai;
const request = supertest(server);

const dataset = require('./../dummy/dataset').dummy1;

function testDataset() {
	before('drop collections', (done) => {
		mongoose.connection.db.dropDatabase();
		done();
	});

	// dataset collection should now be empty
	describe('GET /datasets', () => {
		it('returns status 404 when no datasets found', (done) => {
			request.get('/datasets')
				.expect(404)
				.end((err, res) => {
					expect(res.body.error)
						.to.be.equal(`no datasets found`);
					done(err);
				});
		});
	});

	// test route create dataset
	describe('POST /datasets', () => {
		// create a user that owns the dataset
		// create a new user with a valid dummy
		before('saves a new user', (done) => {
			request.post('/users')
				.send(require('./../dummy/user').dummy1)
				.expect(201)
				.end((err, res) => {
					dataset.userId = res.body._id;
					done(err);
				});
		});

		// create a new event type
		// create a new event with a valid dummy
		before('saves a new event', (done) => {
			request.post('/events')
				.send(require('./../dummy/event').dummy1)
				.expect(201)
				.end((err, res) => {
					for(let i = 0; i < dataset.events.length; i++) {
						dataset.events[i].type = res.body._id;
					}
					done(err);
				});
		});
		// create new labels and labeling
		// create a new labeling with a valid dummy
		before('create first label dummy to refer to in labeling', (done) => {
			request.post('/labels')
				.send(require('./../dummy/label').dummy1)
				.expect(201)
				.end((err, res) => {
					for(let i = 0; i < dataset.labelings[0].labels.length; i++) {
						dataset.labelings[0].labels[i].type = res.body._id;
					}
					done(err);
				});
		});
		before('create second label dummy to refer to in labeling', (done) => {
			request.post('/labels')
				.send(require('./../dummy/label').dummy2)
				.expect(201)
				.end((err, res) => {
					for(let i = 0; i < dataset.labelings[1].labels.length; i++) {
						dataset.labelings[1].labels[i].type = res.body._id;
					}
					done(err);
				});
		});
		before('saves a new labeling', (done) => {
			// create labels to refer to in labeling
			request.get('/labels')
				.expect(200)
				.end((err, res) => {
					const dummy = require('./../dummy/labeling').dummy1;
					dummy.labels = res.body;
					request.post('/labelings')
						.send(dummy)
						.expect(201)
						.end((err2, res2) => {
							for(let i = 0; i < dataset.labelings.length; i++) {
								dataset.labelings[i].labelingId = res2.body._id;
							}
							done(err2);
						});
				});
		});
		// create a new service with a valid dummy
		it('saves a new service', (done) => {
			request.post('/services')
				.send(require('./../dummy/service').dummy1)
				.expect(201)
				.end((err, res) => {
					for(let i = 0; i < dataset.labelings.length; i++) {
						dataset.labelings[i].creator = res.body._id;
					}
					done(err);
				});
		});
		// create device
		// get firmware id
		// create a new firmware with a valid dummy
		before('saves a new firmware', (done) => {
			request.post('/firmware')
				.send(require('./../dummy/firmware').dummy1)
				.expect(201)
				.end((err, res) => {
					done(err);
				});
		});
		before('saves a new device', (done) => {
			request.get('/firmware')
				.expect(200)
				.end((err, res) => {
					const dummy = require('./../dummy/device').dummy1;
					dummy.firmware = res.body[0]._id;
					request.get('/users')
						.expect(200)
						.end((err2, res2) => {
							dummy.user = res2.body[0]._id;
							request.post('/devices')
								.send(dummy)
								.expect(201)
								.end((err3, res3) => {
									dataset.device = res3.body._id;
									done(err3);
								});
						});
				});
		});
		// create a new dataset with a valid dummy
		it('saves a new dataset', (done) => {
			request.post('/datasets')
				.send(dataset)
				.expect(201)
				.end((err, res) => {
					done(err);
				});
		});

		// creating a dataset with an invalid dummy should not be possible
		it('returns status 500 when object format wrong', (done) => {
			request.post('/datasets')
				.send(require('./../dummy/dataset').invalidDummy)
				.expect(500)
				.end((err, res) => {
					done(err);
				});
		});
	});

	// test route create dataset by id
	describe('POST /datasets/:id', () => {
		// it is not allowed to create a dataset for a given id
		it('creating a dataset with id is not allowed', (done) => {
			request.post('/datasets/5d1241f1adc318414d007d73')
				.send(require('./../dummy/dataset').dummy1)
				.expect(500)
				.end((err, res) => {
					expect(res.body.error)
						.to.be.equal('Method Not Allowed');
					done(err);
				});
		});
	});

	// test route get datasets
	describe('GET /datasets', () => {
		// should now return the dataset created above
		it('returns a list of datasets', (done) => {
			request.get('/datasets')
				.expect(200)
				.end((err, res) => {
					expect(res.body)
						.to.be.an('array');
					done(err);
				});
		});
	});

	// test route get dataset by id
	describe('GET /datasets/:id', () => {
		// retrieve id of created dataset and get dataset by id
		it('returns a dataset by id', (done) => {
			Dataset.findOne({}, (error, docs) => {
				if (error) {
					done(error);
				} else {
					request.get(`/datasets/${docs._id}`)
						.expect(200)
						.end((err, res) => {
							expect(res.body)
								.to.have.all.keys('_id', 'device', 'end', 'events', 'fusedSeries',
									'isPublished', 'labelings', 'results', 'start', 'timeSeries', 'userId', 'video', '__v');
							done(err);
						});
				}
			});
		});

		// get dataset with invalid id should return 404
		it('returns status 404 when id is not found', (done) => {
			request.get('/datasets/5d123d130ea6be3a976d375d')
				.expect(404)
				.end((err, res) => {
					expect(res.body.error)
						.to.be.equal(`dataset with id '5d123d130ea6be3a976d375d' not found`);
					done(err);
				});
		});
	});

	// test route update datasets
	describe('PUT /datasets', () => {
		// should return 501 since not implemented yet
		it('update a list of datasets is not implemented yet', (done) => {
			request.put('/datasets')
				.expect(501)
				.end((err, res) => {
					expect(res.body.error)
						.to.be.equal('Not Implemented');
					done(err);
				});
		});
	});

	// test route update dataset by id
	describe('PUT /datasets/:id', () => {
		// update dataset by id with a dummy
		it('update a dataset by id', (done) => {
			Dataset.findOne({}, (error, docs) => {
				if (error) {
					done(error);
				} else {
					request.put(`/datasets/${docs._id}`)
						.send({isPublished: false})
						.expect(200)
						.end((err, res) => {
							expect(res.body.message)
								.to.be.equal(`updated dataset with id: ${docs._id}`);
							done(err);
						});
				}
			});
		});

		// update dataset with invalid id should return 404
		it('returns status 404 when id is not found', (done) => {
			request.get('/datasets/5d123d130ea6be3a976d375d')
				.expect(404)
				.end((err, res) => {
					expect(res.body.error)
						.to.be.equal(`dataset with id '5d123d130ea6be3a976d375d' not found`);
					done(err);
				});
		});
	});

	// test route delete dataset by id
	describe('DELETE /datasets/:id', () => {
		it('delete a dataset by id', (done) => {
			Dataset.findOne({}, (error, docs) => {
				if (error) {
					done(error);
				} else {
					request.delete(`/datasets/${docs._id}`)
						.expect(200)
						.end((err, res) => {
							expect(res.body.message)
								.to.be.equal(`deleted dataset with id: ${docs._id}`);
							done(err);
						});
				}
			});
		});

		// delete dataset with invalid id should return 404
		it('returns status 404 when id is not found', (done) => {
			request.get('/datasets/5d123d130ea6be3a976d375d')
				.expect(404)
				.end((err, res) => {
					expect(res.body.error)
						.to.be.equal(`dataset with id '5d123d130ea6be3a976d375d' not found`);
					done(err);
				});
		});
	});

	// test route delete datasets
	describe('DELETE /datasets', () => {
		// create two more datasets
		// so we have at least two datasets in db for testing multiple deletion
		it('create first dataset dummy to delete multiple datasets', (done) => {
			request.post('/datasets')
				.send(dataset)
				.expect(201)
				.end((err, res) => {
					done(err);
				});
		});
		it('create second dataset dummy to delete multiple datasets', (done) => {
			request.post('/datasets')
				.send(dataset)
				.expect(201)
				.end((err, res) => {
					done(err);
				});
		});

		// now delete all datasets
		it('delete all datasets', (done) => {
			request.delete(`/datasets`)
				.expect(200)
				.end((err, res) => {
					expect(res.body.message)
						.to.be.equal(`deleted all datasets`);
					done(err);
				});
		});

		// since we just deleted all datasets, get datasets should return 404
		it('should 404 since we just deleted all datasets', (done) => {
			request.get('/datasets')
				.expect(404)
				.end((err, res) => {
					expect(res.body.error)
						.to.be.equal(`no datasets found`);
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

		// now delete all events
		it('delete all events', (done) => {
			request.delete(`/events`)
				.expect(200)
				.end((err, res) => {
					expect(res.body.message)
						.to.be.equal(`deleted all events`);
					done(err);
				});
		});

		// since we just deleted all events, get events should return 404
		it('should 404 since we just deleted all events', (done) => {
			request.get('/events')
				.expect(404)
				.end((err, res) => {
					expect(res.body.error)
						.to.be.equal(`no events found`);
					done(err);
				});
		});

		// now delete all labelings
		it('delete all labelings', (done) => {
			request.delete(`/labelings`)
				.expect(200)
				.end((err, res) => {
					expect(res.body.message)
						.to.be.equal(`deleted all labelings`);
					done(err);
				});
		});

		// since we just deleted all labelings, get labelings should return 404
		it('should 404 since we just deleted all labelings', (done) => {
			request.get('/labelings')
				.expect(404)
				.end((err, res) => {
					expect(res.body.error)
						.to.be.equal(`no labelings found`);
					done(err);
				});
		});

		// now delete all labels
		it('delete all labels', (done) => {
			request.delete(`/labels`)
				.expect(200)
				.end((err, res) => {
					expect(res.body.message)
						.to.be.equal(`deleted all labels`);
					done(err);
				});
		});

		// since we just deleted all labels, get labels should return 404
		it('should 404 since we just deleted all labels', (done) => {
			request.get('/labels')
				.expect(404)
				.end((err, res) => {
					expect(res.body.error)
						.to.be.equal(`no labels found`);
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

module.exports = testDataset;
