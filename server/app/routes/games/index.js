'use strict';
var router = require('express').Router();
module.exports = router;
var _ = require('lodash');
var Game = require('../../../db/models/game.js')
var Review = require('../../../db/models/review.js')

router.get('/', function (req,res){
	Game.find({})
	.then(function(games){
		res.send(games.data)
	},function(){
		res.sendStatus(404)
	})
})

router.get('/:id', function (req,res){
	Game.find({_id: req.params.id})
	.then(function(game){
		res.send(game.data)
	},function(err){
		res.sendStatus(404)
	})
})

router.get('/:id/reviews', function(req,res){
	Review.find({game: req.params.id})
	.then(function(reviews){
		res.send(reviews.data)
	},function(err){
		res.sendStatus(404)
	})
})
