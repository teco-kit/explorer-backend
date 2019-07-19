const supertest = require('supertest');
const mongoose = require('mongoose');
const chai = require('chai');

const server = require('../../server.js');
const User = require('./../../models/user').model;

const {expect} = chai;
const request = supertest(server);

function testUser() {
	before('drop collections', (done) => {
		mongoose.connection.db.dropDatabase();
		done();
	});

	// user collection should now be empty
	describe('GET /users', () => {
		it('returns status 404 when no users found', (done) => {
			request.get('/users')
				.expect(404)
				.end((err, res) => {
					expect(res.body.error)
						.to.be.equal(`no users found`);
					done(err);
				});
		});
	});

	// test route create user
	describe('POST /users', () => {
		// create a new user with a valid dummy
		it('saves a new user', (done) => {
			request.post('/users')
				.send(require('./../dummy/user').dummy1)
				.expect(201)
				.end((err, res) => {
					done(err);
				});
		});

		// creating a user with an invalid dummy should not be possible
		it('returns status 500 when object format wrong', (done) => {
			request.post('/users')
				.send(require('./../dummy/user').invalidDummy)
				.expect(500)
				.end((err, res) => {
					done(err);
				});
		});
	});

	// test route create user by id
	describe('POST /users/:id', () => {
		// it is not allowed to create a user for a given id
		it('creating a user with id is not allowed', (done) => {
			request.post('/users/5d1241f1adc318414d007d73')
				.send(require('./../dummy/user').dummy1)
				.expect(500)
				.end((err, res) => {
					expect(res.body.error)
						.to.be.equal('Method Not Allowed');
					done(err);
				});
		});
	});

	// test route get users
	describe('GET /users', () => {
		// should now return the user created above
		it('returns a list of users', (done) => {
			request.get('/users')
				.expect(200)
				.end((err, res) => {
					expect(res.body.data)
						.to.be.an('array');
					done(err);
				});
		});
	});

	// test route get user by id
	describe('GET /users/:id', () => {
		// retrieve id of created user and get user by id
		it('returns a user by id', (done) => {
			User.findOne({}, (error, docs) => {
				if (error) {
					done(error);
				} else {
					request.get(`/users/${docs._id}`)
						.expect(200)
						.end((err, res) => {
							expect(res.body.data)
								.to.have.all.keys('_id', 'name', 'email', 'password',
									'sex', 'birthday', 'weight', 'platform', 'clientVersion', '__v');
							done(err);
						});
				}
			});
		});

		// get user with invalid id should return 404
		it('returns status 404 when id is not found', (done) => {
			request.get('/users/5d123d130ea6be3a976d375d')
				.expect(404)
				.end((err, res) => {
					expect(res.body.error)
						.to.be.equal(`user with id '5d123d130ea6be3a976d375d' not found`);
					done(err);
				});
		});
	});

	// test route update users
	describe('PUT /users', () => {
		// should return 501 since not implemented yet
		it('update a list of users is not implemented yet', (done) => {
			request.put('/users')
				.expect(501)
				.end((err, res) => {
					expect(res.body.error)
						.to.be.equal('Not Implemented');
					done(err);
				});
		});
	});

	// test route update user by id
	describe('PUT /users/:id', () => {
		// update user by id with a dummy
		it('update a user by id', (done) => {
			User.findOne({}, (error, docs) => {
				if (error) {
					done(error);
				} else {
					request.put(`/users/${docs._id}`)
						.send(require('./../dummy/user').dummy2)
						.expect(200)
						.end((err, res) => {
							expect(res.body.message)
								.to.be.equal(`updated user with id: ${docs._id}`);
							done(err);
						});
				}
			});
		});

		// update user with invalid id should return 404
		it('returns status 404 when id is not found', (done) => {
			request.get('/users/5d123d130ea6be3a976d375d')
				.expect(404)
				.end((err, res) => {
					expect(res.body.error)
						.to.be.equal(`user with id '5d123d130ea6be3a976d375d' not found`);
					done(err);
				});
		});
	});

	// test route delete user by id
	describe('DELETE /users/:id', () => {
		it('delete a user by id', (done) => {
			User.findOne({}, (error, docs) => {
				if (error) {
					done(error);
				} else {
					request.delete(`/users/${docs._id}`)
						.expect(200)
						.end((err, res) => {
							expect(res.body.message)
								.to.be.equal(`deleted user with id: ${docs._id}`);
							done(err);
						});
				}
			});
		});

		// delete user with invalid id should return 404
		it('returns status 404 when id is not found', (done) => {
			request.get('/users/5d123d130ea6be3a976d375d')
				.expect(404)
				.end((err, res) => {
					expect(res.body.error)
						.to.be.equal(`user with id '5d123d130ea6be3a976d375d' not found`);
					done(err);
				});
		});
	});

	// test route delete users
	describe('DELETE /users', () => {
		// create two more users
		// so we have at least two users in db for testing multiple deletion
		it('create first user dummy to delete multiple users', (done) => {
			request.post('/users')
				.send(require('./../dummy/user').dummy1)
				.expect(201)
				.end((err, res) => {
					done(err);
				});
		});
		it('create second user dummy to delete multiple users', (done) => {
			request.post('/users')
				.send(require('./../dummy/user').dummy2)
				.expect(201)
				.end((err, res) => {
					done(err);
				});
		});

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

module.exports = testUser;
