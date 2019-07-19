const supertest = require('supertest');
const mongoose = require('mongoose');
const chai = require('chai');

const server = require('../../../server.js');

const {expect} = chai;
const request = supertest(server);

const dataset = require('../../dummy/dataset').dummy1;

function testVideo() {
	before('drop collections', (done) => {
		mongoose.connection.db.dropDatabase();
		done();
	});

	// create a dataset, delete video, so we can test video subroutes
	// test route create dataset
	// test route create dataset
	describe('POST /datasets', () => {
		// delete video from dummy
		dataset.video = {};

		// create a user that owns the dataset
		// create a new user with a valid dummy
		before('saves a new user', (done) => {
			request.post('/users')
				.send(require('../../dummy/user').dummy1)
				.expect(201)
				.end((err, res) => {
					dataset.userId = res.body.data._id;
					done(err);
				});
		});

		// create a new event type
		// create a new event with a valid dummy
		before('saves a new event', (done) => {
			request.post('/events')
				.send(require('../../dummy/event').dummy1)
				.expect(201)
				.end((err, res) => {
					for (let i = 0; i < dataset.events.length; i++) {
						dataset.events[i].type = res.body.data._id;
					}
					done(err);
				});
		});
		// create new labels and labeling
		// create a new labeling with a valid dummy
		before('create first label dummy to refer to in labeling', (done) => {
			request.post('/labels')
				.send(require('../../dummy/label').dummy1)
				.expect(201)
				.end((err, res) => {
					for (let i = 0; i < dataset.labelings[0].labels.length; i++) {
						dataset.labelings[0].labels[i].type = res.body.data._id;
					}
					done(err);
				});
		});
		before('create second label dummy to refer to in labeling', (done) => {
			request.post('/labels')
				.send(require('../../dummy/label').dummy2)
				.expect(201)
				.end((err, res) => {
					for (let i = 0; i < dataset.labelings[1].labels.length; i++) {
						dataset.labelings[1].labels[i].type = res.body.data._id;
					}
					done(err);
				});
		});
		before('saves a new labeling', (done) => {
			// create labels to refer to in labeling
			request.get('/labels')
				.expect(200)
				.end((err, res) => {
					const dummy = require('../../dummy/labeling').dummy1;
					dummy.labels = res.data;
					request.post('/labelings')
						.send(dummy)
						.expect(201)
						.end((err2, res2) => {
							for (let i = 0; i < dataset.labelings.length; i++) {
								dataset.labelings[i].labelingId = res2.body.data._id;
							}
							done(err2);
						});
				});
		});
		// create a new service with a valid dummy
		it('saves a new service', (done) => {
			request.post('/services')
				.send(require('../../dummy/service').dummy1)
				.expect(201)
				.end((err, res) => {
					for (let i = 0; i < dataset.labelings.length; i++) {
						dataset.labelings[i].creator = res.body.data._id;
					}
					done(err);
				});
		});
		// create device
		// get firmware id
		// create a new firmware with a valid dummy
		before('saves a new firmware', (done) => {
			request.post('/firmware')
				.send(require('../../dummy/firmware').dummy1)
				.expect(201)
				.end((err, res) => {
					done(err);
				});
		});
		before('saves a new device', (done) => {
			request.get('/firmware')
				.expect(200)
				.end((err, res) => {
					const dummy = require('../../dummy/device').dummy1;
					dummy.firmware = res.body.data[0]._id;
					request.get('/users')
						.expect(200)
						.end((err2, res2) => {
							dummy.user = res2.body.data[0]._id;
							request.post('/devices')
								.send(dummy)
								.expect(201)
								.end((err3, res3) => {
									dataset.device = res3.body.data._id;
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
					dataset._id = res.body.data._id;
					done(err);
				});
		});
	});

	describe(`GET /datasets/5d123d130ea6be3a976d375d/video`, () => {
		it('returns status 404 when dataset not found', (done) => {
			request.get(`/datasets/5d123d130ea6be3a976d375d/video`)
				.expect(404)
				.end((err, res) => {
					expect(res.body.error)
						.to.be.equal(`no dataset found`);
					done(err);
				});
		});
	});

	// test route create video
	describe(`POST /datasets/:datasetID/video`, () => {
		// create a new video with a valid dummy
		it('saves a new video', (done) => {
			request.post(`/datasets/${dataset._id}/video`)
				.send(require('../../dummy/video').dummy1)
				.expect(201)
				.end((err, res) => {
					done(err);
				});
		});
	});

	// test route create label by id
	describe(`POST /datasets/:datasetID/video`, () => {
		// it is not allowed to create a label for a given id
		it('creating a video with id is not allowed', (done) => {
			request.post(`/datasets/${dataset._id}/video/5d123d130ea6be3a976d375d`)
				.send(require('../../dummy/video').dummy1)
				.expect(500)
				.end((err, res) => {
					expect(res.body.error)
						.to.be.equal('Method Not Allowed');
					done(err);
				});
		});
	});

	// test route update video
	describe(`PUT /datasets/:datasetID/video`, () => {
		// update label by id with a dummy
		it('update video', (done) => {
			request.put(`/datasets/${dataset._id}/video`)
				.send(require('../../dummy/video').dummy2)
				.expect(200)
				.end((err, res) => {
					expect(res.body.message)
						.to.be.equal(`updated video for dataset with id: ${dataset._id}`);
					done(err);
				});
		});

		// update video with invalid dataset id should return 404
		it('returns status 404 when id is not found', (done) => {
			request.put('/datasets/5d123d130ea6be3a976d375d/video')
				.send(require('../../dummy/video').dummy2)
				.expect(404)
				.end((err, res) => {
					expect(res.body.error)
						.to.be.equal(`dataset with id '5d123d130ea6be3a976d375d' not found`);
					done(err);
				});
		});
	});

	// test route delete label by id
	describe(`DELETE /datasets/:datasetID/video`, () => {
		it('delete video', (done) => {
			request.delete(`/datasets/${dataset._id}/video`)
				.expect(200)
				.end((err, res) => {
					expect(res.body.message)
						.to.be.equal(`deleted video for dataset with id: ${dataset._id}`);
					done(err);
				});
		});

		// delete label with invalid id should return 404
		it('returns status 404 when id is not found', (done) => {
			request.delete(`/datasets/5d123d130ea6be3a976d375d/video`)
				.expect(404)
				.end((err, res) => {
					expect(res.body.error)
						.to.be.equal(`dataset with id '5d123d130ea6be3a976d375d' not found`);
					done(err);
				});
		});

		// after deleting there should be no video
		it('returns status 404 when video not found', (done) => {
			request.get(`/datasets/${dataset._id}/video`)
				.expect(404)
				.end((err, res) => {
					expect(res.body.error)
						.to.be.equal('no video found');
					done(err);
				});
		});
	});

	// test route delete labels
	describe('DELETE /datasets', () => {
		// now delete all labels
		it('delete all datasets', (done) => {
			request.delete(`/datasets`)
				.expect(200)
				.end((err, res) => {
					expect(res.body.message)
						.to.be.equal(`deleted all datasets`);
					done(err);
				});
		});

		// since we just deleted all labels, get labels should return 404
		it('should 404 since we just deleted all datasets', (done) => {
			request.get('/datasets')
				.expect(404)
				.end((err, res) => {
					expect(res.body.error)
						.to.be.equal(`no datasets found`);
					done(err);
				});
		});
	});
}

module.exports = testVideo;
