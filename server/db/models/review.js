'use strict';
var mongoose = require('mongoose');

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

module.exports = Review;