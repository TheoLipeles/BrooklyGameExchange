'use strict';
var mongoose = require('mongoose');
var User = require('./user');
var Game = require('./game');

var schema = new mongoose.Schema({
    title: {
    	type: String,
    	required: true
    },
    text: {
    	type: String,
    	required: true
    },
    rating: Number,
    game: {type: mongoose.Schema.ObjectId, ref: 'Game'},
    author: {type: mongoose.Schema.ObjectId, ref: 'User'}
});

var Review = mongoose.model('Review', schema);

schema.post('save',function(next){
    User.findByIdAndUpdate(this.author, {$push: {reviews: this._id}})
    .exec()
    .then(function(user){
        console.log("review added to", user.reviews);
        next();
    })
    .then(null, function(err){
        console.log(err);
    });
});

schema.post('save', function(next){
    Game.findByIdAndUpdate(this.game, {$push: {reviews: this._id}})
    .exec()
    .then(function(game){
        console.log("game added to", game.reviews);
        next();
    })
    .then(null, function(err){
        console.log(err);
    });
});

module.exports = Review;