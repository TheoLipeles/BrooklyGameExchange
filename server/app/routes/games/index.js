'use strict';
var router = require('express').Router();
module.exports = router;
// var _ = require('lodash');
var Game = require('../../../db/models/game.js');
var Review = require('../../../db/models/review.js');

router.get('/', function (req,res){
	Game.find({})
	.then(function(games){
		res.json(games);
	},function(){
		res.sendStatus(404);
	});
});

router.get('/:id', function (req,res){
	Game.findOne({_id: req.params.id}).populate("developer reviews").exec()
	.then(function(game){
		res.json(game);
	},function(err){
		res.status(404).send(err);
	});
});

router.get('/:id/reviews', function(req,res){
	Review.find({game: req.params.id}).populate("reviews").exec()
	.then(function(reviews){
		res.json(reviews);
	},function(err){
		res.status(404).send(err);
	});
});

