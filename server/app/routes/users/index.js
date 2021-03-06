'use strict';
var router = require('express').Router();
// var _ = require('lodash');
var User = require('../../../db/models/user');
var Game = require('../../../db/models/game');
var Review = require('../../../db/models/review');
var getRecommendations = require('../../../db/recEngine/recEngine.js');



var ensureAuthenticated = function (req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.status(401).end();
    }
};

//GET all users
router.get('/', function (req, res, next) {
    User.find({})
    .then(function(users){
        res.json(users);   
    })
    .then(null, function(err){
        console.log(err);
        next(err);
    });
});

//GET all developers
router.get('/developers', function(req, res, next) {
    User.find({isDev: true})
    .then(function(developers) {
        res.json(developers);
    })
    .then(null, function(err) {
        console.log(err);
        next(err);
    });
});

//GET single user
router.get('/:id', function (req, res, next) {
    User.findById(req.params.id).deepPopulate("createdGames purchaseHistory reviews.game cart.game.developer").exec()
    .then(function(user) {
        console.log(user);
        res.json(user);
    })
    .then(null, function(err){
        console.log(err);
        next(err);
    });
});

//DELETE single user
router.delete('/:id', function (req, res, next) {
    User.findOneAndRemove({_id: req.params.id}).exec()
    .then(function(user) {
        console.log("Removed user", user);
        res.json(user);
    })
    .then(null, function(err){
        console.log(err);
        next(err);
    });
});

//GET all games created by a single developer
router.get('/:id/games', function (req, res, next) {
    Game.find({developer: req.params.id}).populate("reviews").exec()
    .then(function(games){
        res.json(games);   
    })
    .then(null, function(err){
        console.log(err);
        next(err);
    });
});

router.get('/:id/recommended', function(req, res, next) {
    getRecommendations(req.params.id)
    .then(function(games) {
        res.json(games);
    })
    .then(null, function(err) {
        console.log(err);
        next(err);
    });
});

//GET all reviews created by a single user
router.get('/:id/reviews', function (req, res, next) {
    User.findById(req.params.id).populate("reviews").exec()
    .then(function(user){
        res.json(user.reviews);   
    })
    .then(null, function(err){
        console.log(err);
        next(err);
    });
});

//POST new user
router.post('/', function(req, res, next){
    User.create(req.body)
    .then(function(newUser){
        console.log('new user created!');
        res.json(newUser);
    })
    .then(null, function(err){
        console.log(err);
        next(err);
    });
});

//POST game created by developer
router.post('/:id/games', 
    // ensureAuthenticated,
    function (req, res, next) {
        req.body.developer = req.params.id;
        Game.create(req.body)
        .then(function(game){
            console.log("new game created");
            res.json(201, game);   
        })
        .then(null, function(err){
            console.log(err);
            next(err);
        });
    });

//POST review created by user
router.post('/:id/reviews',
    // ensureAuthenticated,
    function (req, res, next) {
        req.body.author = req.params.id;
        Review.create(req.body)
        .then(function(review){
            res.json(201,review);
        })
        .then(null, function(err){
            console.log(err);
            next(err);
        });
    }
    );

//post game to cart
router.post('/:id/cart/',
    function (req, res, next) {
        console.log(req.body.id);
        User.findByIdAndUpdate(req.params.id, {$addToSet: {cart: {_id: req.body.id, game: req.body.id, price: parseInt(req.body.price)} } 
    })
        .then(function() {
            console.log("success");
            res.sendStatus(201);
        })
        .then(null, function(err){
            next(err);
        });
    });


router.delete('/:id/cart/:itemId',
    function(req,res,next) {
        return User.findByIdAndUpdate(req.params.id, {$pull: {cart: {_id: req.params.itemId}}
    })
        .then(function(){
            res.sendStatus(204);
        })
        .then(null, function(err){
            next(err);
        });
    });

router.delete('/:id/cart/',
    function(req,res,next){
        return User.findByIdAndUpdate(req.params.id, {$set: {cart: []}})
        .exec()
        .then(function(cart){
            console.log('cart cleared')
            res.sendStatus(204)
        })
        .then(null, function(err){
            next(err);
        });
    })

router.post('/:id/checkout',
    function(req,res,next){
        console.log("checkout from",req.params.id, req.body)
        return User.findByIdAndUpdate(req.params.id, {$push: {purchaseHistory: {$each: req.body} } }, {new: true, safe: true} )
        .exec()
        .then(function(user){
            console.log("user.findbyidandupdate worked!!",user)
            res.send(200,user)
        })
        .then(null,function(err) {
            next(err);
        });
    });





module.exports = router;