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


    xdescribe('ratings method', function() {
        xit ('calculates average rating for a game', function(done){
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
                game.save();
            })
            .then(function() {
                return Review.create(reviewArray);
            }).then(function(reviews) {
                reviews = reviews.map(function(rev) {
                    return rev._id;
                });
                return Game.findByIdAndUpdate(game._id, {$set: {reviews: reviews}});
            }).then(function(updatedGame) {
                return Game.findById(game._id);
            }).then(function(g) {
                return g.getRating();
            }).then(function(rating) {
                console.log("got Rating", rating);
                expect(rating).to.equal(avg);
                done();
            });
        });
    });
});