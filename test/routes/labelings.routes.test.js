const supertest = require('supertest');
const mongoose = require('mongoose');
const chai = require('chai');

const server = require('../../server.js');
const Labeling = require('../../models/labeling').model;

const {expect} = chai;
const request = supertest(server);

function testLabeling() {
	before('drop collections', (done) => {
		mongoose.connection.db.dropDatabase();
		done();
	});

	// labeling collection should now be empty
	describe('GET /labelings', () => {
		it('returns status 404 when no labelings found', (done) => {
			request.get('/labelings')
				.expect(404)
				.end((err, res) => {
					expect(res.body.error)
						.to.be.equal(`no labelings found`);
					done(err);
				});
		});
	});

	// test route create labeling
	describe('POST /labelings', () => {
		// create a new labeling with a valid dummy
		it('create first label dummy to refer to in labeling', (done) => {
			request.post('/labels')
				.send(require('./../dummy/label').dummy1)
				.expect(201)
				.end((err, res) => {
					done(err);
				});
		});

		it('create second label dummy to refer to in labeling', (done) => {
			request.post('/labels')
				.send(require('./../dummy/label').dummy2)
				.expect(201)
				.end((err, res) => {
					done(err);
				});
		});

		it('saves a new labeling', (done) => {
			// create labels to refer to in labeling
			request.get('/labels')
				.expect(200)
				.end((err, res) => {
					const dummy = require('./../dummy/labeling').dummy1;
					dummy.labels = res.data;
					request.post('/labelings')
						.send(dummy)
						.expect(201)
						.end((err2, res2) => {
							done(err2);
						});
				});
		});

		// creating a labeling with an invalid dummy should not be possible
		it('returns status 500 when object format wrong', (done) => {
			request.post('/labelings')
				.send(require('./../dummy/labeling').invalidDummy)
				.expect(500)
				.end((err, res) => {
					done(err);
				});
		});
	});

	// test route create labeling by id
	describe('POST /labelings/:id', () => {
		// it is not allowed to create a labeling for a given id
		it('creating a labeling with id is not allowed', (done) => {
			request.post('/labelings/5d1241f1adc318414d007d73')
				.send(require('./../dummy/labeling').dummy1)
				.expect(500)
				.end((err, res) => {
					expect(res.body.error)
						.to.be.equal('Method Not Allowed');
					done(err);
				});
		});
	});

	// test route get labelings
	describe('GET /labelings', () => {
		// should now return the labeling created above
		it('returns a list of labelings', (done) => {
			request.get('/labelings')
				.expect(200)
				.end((err, res) => {
					expect(res.body)
						.to.be.an('array');
					done(err);
				});
		});
	});

	// test route get labeling by id
	describe('GET /labelings/:id', () => {
		// retrieve id of created labeling and get labeling by id
		it('returns a labeling by id', (done) => {
			Labeling.findOne({}, (error, docs) => {
				if (error) {
					done(error);
				} else {
					request.get(`/labelings/${docs._id}`)
						.expect(200)
						.end((err, res) => {
							expect(res.body)
								.to.have.all.keys('_id', 'labels', '__v');
							done(err);
						});
				}
			});
		});

		// get labeling with invalid id should return 404
		it('returns status 404 when id is not found', (done) => {
			request.get('/labelings/5d123d130ea6be3a976d375d')
				.expect(404)
				.end((err, res) => {
					expect(res.body.error)
						.to.be.equal(`labeling with id '5d123d130ea6be3a976d375d' not found`);
					done(err);
				});
		});
	});

	// test route update labelings
	describe('PUT /labelings', () => {
		// should return 501 since not implemented yet
		it('update a list of labelings is not implemented yet', (done) => {
			request.put('/labelings')
				.expect(501)
				.end((err, res) => {
					expect(res.body.error)
						.to.be.equal('Not Implemented');
					done(err);
				});
		});
	});

	// test route update labeling by id
	describe('PUT /labelings/:id', () => {
		// update labeling by id with a dummy
		it('update a labeling by id', (done) => {
			Labeling.findOne({}, (error, docs) => {
				if (error) {
					done(error);
				} else {
					request.put(`/labelings/${docs._id}`)
						.send(require('./../dummy/labeling').dummy2)
						.expect(200)
						.end((err, res) => {
							expect(res.body.message)
								.to.be.equal(`updated labeling with id: ${docs._id}`);
							done(err);
						});
				}
			});
		});

		// update labeling with invalid id should return 404
		it('returns status 404 when id is not found', (done) => {
			request.get('/labelings/5d123d130ea6be3a976d375d')
				.expect(404)
				.end((err, res) => {
					expect(res.body.error)
						.to.be.equal(`labeling with id '5d123d130ea6be3a976d375d' not found`);
					done(err);
				});
		});
	});

	// test route delete labeling by id
	describe('DELETE /labelings/:id', () => {
		it('delete a labeling by id', (done) => {
			Labeling.findOne({}, (error, docs) => {
				if (error) {
					done(error);
				} else {
					request.delete(`/labelings/${docs._id}`)
						.expect(200)
						.end((err, res) => {
							expect(res.body.message)
								.to.be.equal(`deleted labeling with id: ${docs._id}`);
							done(err);
						});
				}
			});
		});

		// delete labeling with invalid id should return 404
		it('returns status 404 when id is not found', (done) => {
			request.get('/labelings/5d123d130ea6be3a976d375d')
				.expect(404)
				.end((err, res) => {
					expect(res.body.error)
						.to.be.equal(`labeling with id '5d123d130ea6be3a976d375d' not found`);
					done(err);
				});
		});
	});

	// test route delete labelings
	describe('DELETE /labelings', () => {
		// create two more labelings
		// so we have at least two labelings in db for testing multiple deletion
		it('create first labeling dummy to delete multiple labelings', (done) => {
			request.post('/labelings')
				.send(require('./../dummy/labeling').dummy1)
				.expect(201)
				.end((err, res) => {
					done(err);
				});
		});
		it('create second labeling dummy to delete multiple labelings', (done) => {
			request.post('/labelings')
				.send(require('./../dummy/labeling').dummy2)
				.expect(201)
				.end((err, res) => {
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
	});
}

module.exports = testLabeling;
