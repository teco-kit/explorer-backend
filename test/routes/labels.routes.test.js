const supertest = require('supertest');
const mongoose = require('mongoose');
const chai = require('chai');

const server = require('../../server.js');
const Label = require('./../../models/labelType').model;

const {expect} = chai;
const request = supertest(server);

function testLabel() {
	before('drop collections', (done) => {
		mongoose.connection.db.dropDatabase();
		done();
	});

	// label collection should now be empty
	describe('GET /labels', () => {
		it('returns status 404 when no labels found', (done) => {
			request.get('/labels')
				.expect(404)
				.end((err, res) => {
					expect(res.body.error)
						.to.be.equal(`no labels found`);
					done(err);
				});
		});
	});

	// test route create label
	describe('POST /labels', () => {
		// create a new label with a valid dummy
		it('saves a new label', (done) => {
			request.post('/labels')
				.send(require('./../dummy/label').dummy1)
				.expect(201)
				.end((err, res) => {
					done(err);
				});
		});

		// creating a label with an invalid dummy should not be possible
		it('returns status 500 when object format wrong', (done) => {
			request.post('/labels')
				.send(require('./../dummy/label').invalidDummy)
				.expect(500)
				.end((err, res) => {
					done(err);
				});
		});
	});

	// test route create label by id
	describe('POST /labels/:id', () => {
		// it is not allowed to create a label for a given id
		it('creating a label with id is not allowed', (done) => {
			request.post('/labels/5d1241f1adc318414d007d73')
				.send(require('./../dummy/label').dummy1)
				.expect(500)
				.end((err, res) => {
					expect(res.body.error)
						.to.be.equal('Method Not Allowed');
					done(err);
				});
		});
	});

	// test route get labels
	describe('GET /labels', () => {
		// should now return the label created above
		it('returns a list of labels', (done) => {
			request.get('/labels')
				.expect(200)
				.end((err, res) => {
					expect(res.body.data)
						.to.be.an('array');
					done(err);
				});
		});
	});

	// test route get label by id
	describe('GET /labels/:id', () => {
		// retrieve id of created label and get label by id
		it('returns a label by id', (done) => {
			Label.findOne({}, (error, docs) => {
				if (error) {
					done(error);
				} else {
					request.get(`/labels/${docs._id}`)
						.expect(200)
						.end((err, res) => {
							expect(res.body.data)
								.to.have.all.keys('_id', 'name', '__v');
							done(err);
						});
				}
			});
		});

		// get label with invalid id should return 404
		it('returns status 404 when id is not found', (done) => {
			request.get('/labels/5d123d130ea6be3a976d375d')
				.expect(404)
				.end((err, res) => {
					expect(res.body.error)
						.to.be.equal(`label with id '5d123d130ea6be3a976d375d' not found`);
					done(err);
				});
		});
	});

	// test route update labels
	describe('PUT /labels', () => {
		// should return 501 since not implemented yet
		it('update a list of labels is not implemented yet', (done) => {
			request.put('/labels')
				.expect(501)
				.end((err, res) => {
					expect(res.body.error)
						.to.be.equal('Not Implemented');
					done(err);
				});
		});
	});

	// test route update label by id
	describe('PUT /labels/:id', () => {
		// update label by id with a dummy
		it('update a label by id', (done) => {
			Label.findOne({}, (error, docs) => {
				if (error) {
					done(error);
				} else {
					request.put(`/labels/${docs._id}`)
						.send(require('./../dummy/label').dummy2)
						.expect(200)
						.end((err, res) => {
							expect(res.body.message)
								.to.be.equal(`updated label with id: ${docs._id}`);
							done(err);
						});
				}
			});
		});

		// update label with invalid id should return 404
		it('returns status 404 when id is not found', (done) => {
			request.get('/labels/5d123d130ea6be3a976d375d')
				.expect(404)
				.end((err, res) => {
					expect(res.body.error)
						.to.be.equal(`label with id '5d123d130ea6be3a976d375d' not found`);
					done(err);
				});
		});
	});

	// test route delete label by id
	describe('DELETE /labels/:id', () => {
		it('delete a label by id', (done) => {
			Label.findOne({}, (error, docs) => {
				if (error) {
					done(error);
				} else {
					request.delete(`/labels/${docs._id}`)
						.expect(200)
						.end((err, res) => {
							expect(res.body.message)
								.to.be.equal(`deleted label with id: ${docs._id}`);
							done(err);
						});
				}
			});
		});

		// delete label with invalid id should return 404
		it('returns status 404 when id is not found', (done) => {
			request.get('/labels/5d123d130ea6be3a976d375d')
				.expect(404)
				.end((err, res) => {
					expect(res.body.error)
						.to.be.equal(`label with id '5d123d130ea6be3a976d375d' not found`);
					done(err);
				});
		});
	});

	// test route delete labels
	describe('DELETE /labels', () => {
		// create two more labels
		// so we have at least two labels in db for testing multiple deletion
		it('create first label dummy to delete multiple labels', (done) => {
			request.post('/labels')
				.send(require('./../dummy/label').dummy1)
				.expect(201)
				.end((err, res) => {
					done(err);
				});
		});
		it('create second label dummy to delete multiple labels', (done) => {
			request.post('/labels')
				.send(require('./../dummy/label').dummy2)
				.expect(201)
				.end((err, res) => {
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

module.exports = testLabel;
