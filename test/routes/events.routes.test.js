const supertest = require('supertest');
const mongoose = require('mongoose');
const chai = require('chai');

const server = require('../../server.js');
const Event = require('../../models/event').model;

const {expect} = chai;
const request = supertest(server);

function testEvent() {
	before('drop collections', (done) => {
		mongoose.connection.db.dropDatabase();
		done();
	});

	// event collection should now be empty
	describe('GET /events', () => {
		it('returns status 404 when no events found', (done) => {
			request.get('/events')
				.expect(404)
				.end((err, res) => {
					expect(res.body.error)
						.to.be.equal(`no events found`);
					done(err);
				});
		});
	});

	// test route create event
	describe('POST /events', () => {
		// create a new event with a valid dummy
		it('saves a new event', (done) => {
			request.post('/events')
				.send(require('./../dummy/event').dummy1)
				.expect(201)
				.end((err, res) => {
					done(err);
				});
		});

		// creating a event with an invalid dummy should not be possible
		it('returns status 500 when object format wrong', (done) => {
			request.post('/events')
				.send(require('./../dummy/event').invalidDummy)
				.expect(500)
				.end((err, res) => {
					done(err);
				});
		});
	});

	// test route create event by id
	describe('POST /events/:id', () => {
		// it is not allowed to create a event for a given id
		it('creating a event with id is not allowed', (done) => {
			request.post('/events/5d1241f1adc318414d007d73')
				.send(require('./../dummy/event').dummy1)
				.expect(500)
				.end((err, res) => {
					expect(res.body.error)
						.to.be.equal('Method Not Allowed');
					done(err);
				});
		});
	});

	// test route get events
	describe('GET /events', () => {
		// should now return the event created above
		it('returns a list of events', (done) => {
			request.get('/events')
				.expect(200)
				.end((err, res) => {
					expect(res.body)
						.to.be.an('array');
					done(err);
				});
		});
	});

	// test route get event by id
	describe('GET /events/:id', () => {
		// retrieve id of created event and get event by id
		it('returns a event by id', (done) => {
			Event.findOne({}, (error, docs) => {
				if (error) {
					done(error);
				} else {
					request.get(`/events/${docs._id}`)
						.expect(200)
						.end((err, res) => {
							expect(res.body)
								.to.have.all.keys('_id', 'name', '__v');
							done(err);
						});
				}
			});
		});

		// get event with invalid id should return 404
		it('returns status 404 when id is not found', (done) => {
			request.get('/events/5d123d130ea6be3a976d375d')
				.expect(404)
				.end((err, res) => {
					expect(res.body.error)
						.to.be.equal(`event with id '5d123d130ea6be3a976d375d' not found`);
					done(err);
				});
		});
	});

	// test route update events
	describe('PUT /events', () => {
		// should return 501 since not implemented yet
		it('update a list of events is not implemented yet', (done) => {
			request.put('/events')
				.expect(501)
				.end((err, res) => {
					expect(res.body.error)
						.to.be.equal('Not Implemented');
					done(err);
				});
		});
	});

	// test route update event by id
	describe('PUT /events/:id', () => {
		// update event by id with a dummy
		it('update a event by id', (done) => {
			Event.findOne({}, (error, docs) => {
				if (error) {
					done(error);
				} else {
					request.put(`/events/${docs._id}`)
						.send(require('./../dummy/event').dummy2)
						.expect(200)
						.end((err, res) => {
							expect(res.body.message)
								.to.be.equal(`updated event with id: ${docs._id}`);
							done(err);
						});
				}
			});
		});

		// update event with invalid id should return 404
		it('returns status 404 when id is not found', (done) => {
			request.get('/events/5d123d130ea6be3a976d375d')
				.expect(404)
				.end((err, res) => {
					expect(res.body.error)
						.to.be.equal(`event with id '5d123d130ea6be3a976d375d' not found`);
					done(err);
				});
		});
	});

	// test route delete event by id
	describe('DELETE /events/:id', () => {
		it('delete a event by id', (done) => {
			Event.findOne({}, (error, docs) => {
				if (error) {
					done(error);
				} else {
					request.delete(`/events/${docs._id}`)
						.expect(200)
						.end((err, res) => {
							expect(res.body.message)
								.to.be.equal(`deleted event with id: ${docs._id}`);
							done(err);
						});
				}
			});
		});

		// delete event with invalid id should return 404
		it('returns status 404 when id is not found', (done) => {
			request.get('/events/5d123d130ea6be3a976d375d')
				.expect(404)
				.end((err, res) => {
					expect(res.body.error)
						.to.be.equal(`event with id '5d123d130ea6be3a976d375d' not found`);
					done(err);
				});
		});
	});

	// test route delete events
	describe('DELETE /events', () => {
		// create two more events
		// so we have at least two events in db for testing multiple deletion
		it('create first event dummy to delete multiple events', (done) => {
			request.post('/events')
				.send(require('./../dummy/event').dummy1)
				.expect(201)
				.end((err, res) => {
					done(err);
				});
		});
		it('create second event dummy to delete multiple events', (done) => {
			request.post('/events')
				.send(require('./../dummy/event').dummy2)
				.expect(201)
				.end((err, res) => {
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
	});
}

module.exports = testEvent;
