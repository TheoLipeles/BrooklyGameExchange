'use strict';
var router = require('express').Router();
module.exports = router;
// var _ = require('lodash');
var Game = require('../../../db/models/game.js');
var Review = require('../../../db/models/review.js');

//Get all games
router.get('/', function (req, res){
	Game.find({}).populate("developer")
	.then(function(games){
		res.json(games);
	},function(){
		res.sendStatus(404);
	});
});

//Get a game
router.get('/:id', function (req, res){
	Game.findOne({_id: req.params.id}).populate("developer reviews author").exec()
	.then(function(game){
		res.json(game);
	},function(err){
		res.status(404).send(err);
	});
});

//Get a game's review
router.get('/:id/reviews', function(req, res){
	Review.find({game: req.params.id}).populate("author game").exec()
	.then(function(reviews){
		res.json(reviews);
	},function(err){
		res.status(404).send(err);
	});
});

//Delete a game
router.delete('/:id', function(req, res){
	Game.findOneAndRemove({_id: req.params.id}).exec()
	.then(function(removedGame){
		res.json(removedGame);
	},function(err){
		res.status(404).send(err);
	});
});
