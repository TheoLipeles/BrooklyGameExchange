var dbURI = 'mongodb://localhost:27017/testingDB';
var clearDB = require('mocha-mongoose')(dbURI);

var sinon = require('sinon');
var expect = require('chai').expect;
var mongoose = require('mongoose');

// Require in all models.
require('../../../server/db/models');

var Review = mongoose.model('Review');

describe('Review model', function () {

    beforeEach('Establish DB connection', function (done) {
        if (mongoose.connection.db) return done();
        mongoose.connect(dbURI, done);
    });

    afterEach('Clear test database', function (done) {
        clearDB(done);
    });

    it('should exist', function () {
        expect(Review).to.be.a('function');
    });

    describe('required fields', function(){

        it('does not allow a Review to be created without a title', function(done){
            Review.create({text: 'pete'})
            .then(null, function(err){
                expect(err).to.be.a('object');
                done();
            });
        });

        it('does not allow a Review to be created without a text', function(done){
            Review.create({title: 'pete'})
            .then(null, function(err){
                expect(err).to.be.a('object');
                done();
            });
        });
    });
});