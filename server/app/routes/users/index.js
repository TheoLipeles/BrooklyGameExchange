'use strict';
var router = require('express').Router();
var _ = require('lodash');
var User = require('../../../db/models/user');

var ensureAuthenticated = function (req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.status(401).end();
    }
};

router.get('/:id', function (req, res) {
    User.findbyId({_id: req.body.id})
    .then(function(user){
        res.send(user.data);   
    })
    .then(null, function(err){
        var err = new Error('User Not Found');
        err.status = 404;
        next(err);
    });
});

router.get('/:id/games', function (req, res) {
    User.findbyId({_id: req.body.id})
    .then(function(user){
        res.send(user.data.games);   
    })
    .then(null, function(err){
        var err = new Error('User Not Found');
        err.status = 404;
        next(err);
    });
});

router.get('/:id/reviews', function (req, res) {
    User.findbyId({_id: req.body.id})
    .then(function(user){
        res.send(user.data.reviews);   
    })
    .then(null, function(err){
        var err = new Error('User Not Found');
        err.status = 404;
        next(err);
    });
});

router.post('/:id/games', ensureAuthenticated, function (req, res) {
    Game.create({req.body})
    .save()
    .then(function(game){
        res.send(game);   
    })
    .then(null, function(err){
        var err = new Error('Error: Game Not Created');
        err.status = 500;
        next(err);
    });
});

router.post('/:id/reviews', ensureAuthenticated, function (req, res) {
    Review.create({req.body})
    .save()
    .then(function(review){
        res.send(review);   
    })
    .then(null, function(err){
        var err = new Error('Error: Review Not Created');
        err.status = 500;
        next(err);
    });
});

module.exports = router;