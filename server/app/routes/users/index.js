'use strict';
var router = require('express').Router();
// var _ = require('lodash');
var User = require('../../../db/models/user');
var Game = require('../../../db/models/game');
var Review = require('../../../db/models/review');

var ensureAuthenticated = function (req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.status(401).end();
    }
};

router.get('/', function (req, res, next) {
    User.find({})
    .then(function(users){
        res.json(users);   
    })
    .then(null, function(){
        var err = new Error('You Ain\'t got No Users!');
        err.status = 404;
        next(err);
    });
});

router.get('/:id', function (req, res, next) {
    console.log("this route")
    User.findById(req.params.id)
    .then(function(user){
        res.json(user);   
    })
    .then(null, function(){
        var err = new Error('User Not Found');
        err.status = 404;
        next(err);
    });
});

router.get('/:id/games', function (req, res, next) {
    User.findById(req.params.id)
    .then(function(user){
        res.json(user.createdGames);   
    })
    .then(null, function(){
        var err = new Error('User Not Found');
        err.status = 404;
        next(err);
    });
});

router.get('/:id/reviews', function (req, res, next) {
    User.findById(req.params.id)
    .then(function(user){
        res.json(user.reviews);   
    })
    .then(null, function(){
        var err = new Error('User Not Found');
        err.status = 404;
        next(err);
    });
});

router.post('/:id/games', 
    // ensureAuthenticated,

    function (req, res, next) {
        console.log("new games route")
        req.body.developer = req.params.id;
        Game.create(req.body)
        .then(function(game){
            game.save()
            .then(function(){
                res.json(201,game);   
            });
        })
        .then(null, function(){
            var err = new Error('Error: Game Not Created');
            err.status = 500;
            next(err);
        });
    });


router.post('/:id/reviews',
    // ensureAuthenticated,
    function (req, res, next) {
        req.body.author = req.params.id;
        Review.create(req.body)

        .then(function(review){
            review.save()
            .then(function(){
                res.json(201,review);   
            });
        })
        .then(null, function(){
            var err = new Error('Error: Review Not Created');
            err.status = 500;
            next(err);
        });
    });

module.exports = router;