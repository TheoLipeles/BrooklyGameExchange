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
        type: String
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

schema.pre('save',function(next){
    User.findByIdAndUpdate(this.developer, {$push: {createdGames: this._id}})
    .then(function(user){
        console.log("game added to", user.createdGames);
        next();
    })
    .then(null, function(err){
        console.log(err);
    });
});

// schema.virtual('rating').get(function() {
//     return this.populate('reviews').exec()
//         .then(function(game){
//             var sum = game.reviews.reduce(function(a,b){
//                 return a.rating + b.rating;
//             }, 0);
//             var avg = sum / game.reviews.length;
//             return Math.round(avg * 10) / 10;
//         });
// });
// schema.methods.getRating = function() {
//     Promise.resolve(this).then(function(thing) {
//         return thing;
//     }).populate('reviews', 'rating')
//         .exec(function(err, game){
//             if (err) return console.log(err);
//             console.log("game");
//             var sum = game.reviews.reduce(function(a,b){
//                 return a.rating + b.rating;
//             }, 0);
//             var avg = sum / game.reviews.length;
//             return Math.round(avg * 10) / 10;
//         });
// };

var Game = mongoose.model('Game', schema);



module.exports = Game;