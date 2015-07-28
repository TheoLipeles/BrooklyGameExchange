'use strict';
// Instantiate all models
var mongoose = require('mongoose');
// var models = require('../../../server/db/models');
var User = mongoose.model('User');
var Game = mongoose.model('Game');

var expect = require('chai').expect;

var dbURI = 'mongodb://localhost:27017/testingDB';
var clearDB = require('mocha-mongoose')(dbURI);

var supertest = require('supertest');

var app = require('../../../server/app');
var agent = supertest.agent(app);

describe('Users Route', function () {

	beforeEach('Establish DB connection', function (done) {
		if (mongoose.connection.db) return done();
		mongoose.connect(dbURI, done);
	});

	afterEach('Clear test database', function (done) {
		clearDB(done);
	});


	describe('Users request', function () {

		var testUser;

		beforeEach(function (done) {
				User.create({
					email: 'test@test.com',
					createdGames: [],
					reviews: []
				}, function (err, user) {
					if (err) return done(err);
					testUser = user;
					done();
				});
			});


		it('should get all users', function (done) {
			agent
			.get('/api/users')
			.expect(200)
			.end(function (err, res) {
					if (err) return done(err);
					expect(res.body).to.be.instanceof(Array);
					expect(res.body[0].email).to.equal('test@test.com');
					done();
				});
		});

		it('should get one user', function (done) {
			agent
			.get('/api/users/' + testUser._id)
			.expect(200)
			.end(function (err, res) {
					if (err) return done(err);
					expect(res.body).to.be.instanceof(Object);
					expect(res.body.email).to.equal('test@test.com');
					expect(res.body._id).to.equal(testUser._id + '');
					done();
				});
		});

		it('should get all games that a user created', function (done) {
			agent
			.get('/api/users/'+ testUser._id + '/games')
			.expect(200)
			.end(function (err, res) {
					if (err) return done(err);
					expect(res.body).to.be.instanceof(Array);
					done();
				});
		});

		it('should get all reviews of one user', function (done) {
			agent
			.get('/api/users/'+ testUser._id + '/reviews')
			.expect(200)
			.end(function (err, res) {
					if (err) return done(err);
					expect(res.body).to.be.instanceof(Array);
					done();
				});
		});

		it('should post one game for sale', function (done) {
				agent
				.post('/api/users/'+ testUser._id + '/games')
				.send({
					title: 'test game'
				})
				.expect(201)
				.end(function (err, res) {
					if (err) return done(err);
					expect(res.body.title).to.equal('test game');
					done();
				});
			});

		it('should post one review', function (done) {
				agent
				.post('/api/users/'+ testUser._id + '/reviews')
				.send({
					title: 'test review'
				})
				.expect(201)
				.end(function (err, res) {
					if (err) return done(err);
					expect(res.body.title).to.equal('test review');
					done();
				});
			});

	});

});
