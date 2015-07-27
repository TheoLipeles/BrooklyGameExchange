'use strict';
var router = require('express').Router();
module.exports = router;
// var _ = require('lodash');
var Game = require('../../../db/models/game.js')
var Review = require('../../../db/models/review.js')

router.get('/', function (req,res){
<<<<<<< Updated upstream
	console.log("hey!")
	Game.find({})
	.then(function(games){
		res.send(games)
=======
	Game.find({})
	.then(function(games){
		res.send(games.data)
>>>>>>> Stashed changes
	},function(){
		res.sendStatus(404)
	})
})

router.get('/:id', function (req,res){
	Game.find({_id: req.params.id})
	.then(function(game){
<<<<<<< Updated upstream
		res.send(game)
	},function(err){
=======
		res.send(game.data)
	},function(){
>>>>>>> Stashed changes
		res.sendStatus(404)
	})
})

router.get('/:id/reviews', function(req,res){
	Review.find({game: req.params.id})
	.then(function(reviews){
<<<<<<< Updated upstream
		res.send(reviews)
	},function(err){
=======
		res.send(reviews.data)
	},function(){
>>>>>>> Stashed changes
		res.sendStatus(404)
	})
})

