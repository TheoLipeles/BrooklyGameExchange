'use strict';
var mongoose = require('mongoose');

var schema = new mongoose.Schema({
    title: {
        type: String
    },
    description: {
        type: String
    },
    screenshots: [String],
    price: Number,
    downloads: Number,
    genre: String,
    developer: {type: mongoose.Schema.ObjectId, ref: 'User'},
    reviews: [{type: mongoose.Schema.ObjectId, ref: 'Review'}]
});

schema.virtual('rating').get(function() {
    return this.populate('reviews').exec(function(err, reviews){
        if (err) return console.log(err);
        var sum = reviews.reduce(function(a,b){
            return a.rating + b.rating;
        }, 0);
        return sum / reviews.length;
    });
});

var Game = mongoose.model('Game', schema);


module.exports = Game;