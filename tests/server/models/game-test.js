var dbURI = 'mongodb://localhost:27017/testingDB';
var clearDB = require('mocha-mongoose')(dbURI);

var sinon = require('sinon');
var expect = require('chai').expect;
var mongoose = require('mongoose');

// Require in all models.
require('../../../server/db/models');

var Game = mongoose.model('Game');
var Review = mongoose.model('Review');

describe('Game model', function () {

    beforeEach('Establish DB connection', function (done) {
        if (mongoose.connection.db) return done();
        mongoose.connect(dbURI, done);
    });

    afterEach('Clear test database', function (done) {
        clearDB(done);
    });

    it('should exist', function () {
        expect(Game).to.be.a('function');
    });


    describe('ratings virtual', function() {
        it ('calculates average rating for a game', function(done){
            var avg, game;
            var reviewArray = [];

            Game.create({title: "Mario_Bros", description: "A 5th dimensional flatform shooter"})
            .then(function(newGame){
                var sum = 0;
                var randRating, review;
                for (var i = 0; i < 3; i++) {
                    randRating = Math.floor((Math.random() * 5) + 1);
                    review = {
                        game: newGame._id,
                        rating: randRating
                    };
                    sum += randRating;
                    reviewArray.push(review);
                }
                avg = sum / reviewArray.length;
                avg = Math.round(avg * 10) / 10;
                game = newGame;
                return true;
            })
            .then(function() {
                Review.create(reviewArray[0])
                .then(function(){
                    Review.create(reviewArray[1])
                })
                .then(function(){
                    Review.create(reviewArray[2])
                })
                .then(function(){
                    done();
                });
            });
        });
    });
});