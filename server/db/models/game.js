'use strict';
var mongoose = require('mongoose');
var User = require('./user');

var schema = new mongoose.Schema({
    title: {
        type: String,
        default: 'untitled',
        unique: true
    },
    description: {
        type: String,
        default: ""
    },
    screenshots: [String],
    minPrice: {
        type: Number,
        default: 0
    },
    downloads: {
        type: Number,
        default: 0
    },
    downloadLink: String,
    genre: String,
    developer: {type: mongoose.Schema.ObjectId, ref: 'User'},
    reviews: [{type: mongoose.Schema.ObjectId, ref: 'Review'}]
});

schema.post('save',function(next){
    User.findByIdAndUpdate(this.developer, {$push: {createdGames: this._id}})
    .then(function(user){
        console.log(user);
        console.log("game added to", user.createdGames);
        next();
    })
    .then(null, function(err){
        console.log(err);
    });
});

var Game = mongoose.model('Game', schema);



module.exports = Game;