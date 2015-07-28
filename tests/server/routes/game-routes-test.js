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

describe('Games Route', function () {

	beforeEach('Establish DB connection', function (done) {
		if (mongoose.connection.db) return done();
		mongoose.connect(dbURI, done);
	});

	afterEach('Clear test database', function (done) {
		clearDB(done);
	});

	describe('Games route', function(){

		var testGame;

		beforeEach(function(done){
			Game.create({
				title: "Zelda",
				description: "you are link",
				reviews: []
			}, function (err,game){
				if (err) return done(err);
				testGame = 	game;
				done();
			});
		});

	it ('should get all games', function(done){
		agent
		.get('/api/games')
		.expect(200)
		.end(function (err, res) {
				// console.log("body for get all games:",res.body);
				if (err) return done(err);
				expect(res.body).to.be.instanceof(Array);
				expect(res.body[0].title).to.equal('Zelda');
				done();
			});
		});

	it ('should get a game with a specific _id', function(done){
		agent
		.get('/api/games/' + testGame._id)
		.expect(200)
		.end(function (err, res) {
				// console.log("body for one game:",res.body);
				if (err) return done(err);
				expect(res.body).to.be.instanceOf(Object);
				expect(res.body.title).to.equal('Zelda');
				expect(res.body._id).to.equal(testGame._id + '');
				done();
			})
		});

	it ('should get all reviews for a specific game', function(done){
		agent
		.get('/api/games/'+ testGame._id + '/reviews')
		.expect(200)
		.end(function (err, res) {
				if (err) return done(err);
				expect(res.body).to.be.instanceof(Array);
				done();
			});
		});

	});
})