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
    developer: {type: mongoose.Schema.ObjectId, ref: 'User'},
    reviews: [{type: mongoose.Schema.ObjectId, ref: 'Review'}]
});


var Game = mongoose.model('Game', schema);


module.exports = Game;