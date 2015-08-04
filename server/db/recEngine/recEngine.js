var mongoose = require("mongoose");
var Promise = require('bluebird');
// var Bucket = Promise.promisifyAll(mongoose.model('Bucket'));
// var Action = Promise.promisifyAll(mongoose.model('Action'));
var User = Promise.promisifyAll(mongoose.model('User'));
var Game = Promise.promisifyAll(mongoose.model('Game'));

var getRecommendations = function(id) {
	var userPurchaseHistory;
	var allUsers = [];
	var gamesNotInCommon = [];

	var comparePurchaseHistory = function(recommender) {
		var totalInCommon = 0;
		for (var i = 0; i < recommender.length; i++) {
			if (userPurchaseHistory.indexOf(recommender.purchaseHistory[i]) !== -1 && gamesNotInCommon.indexOf(recommender.purchaseHistory[i]) !== -1) {
				totalInCommon++;
			} else {
				gamesNotInCommon.push(recommender.purchaseHistory[i]);
			}
		}
		return totalInCommon / (userPurchaseHistory.length + recommender.purchaseHistory.length - totalInCommon);
	};

	var compareFunc = function(a, b) {
		a.similarity = comparePurchaseHistory(a);
		b.similarity = comparePurchaseHistory(b);
		return a.similarity - b.similarity;
	};

	var gameRecommendationValue = function(game) {
		var totalInCommon = 0;
		for (var i = 0; i < allUsers.length; i++) {
			if (allUsers[i].indexOf(game) !== -1) {
				totalInCommon += allUsers[i].similarity;
			}
		}
	};


	var compareGameFunc = function(a, b) {
		return gameRecommendationValue(a._id) - gameRecommendationValue(b._id);
	};

	return User.findById(id)
	.then(function(user) {
		userPurchaseHistory = user.purchaseHistory;
		return User.find({});
	})
	.then(function(users) {
		console.log(users);
		users.map(function(user) {
			console.log(typeof(user._id));
			allUsers.push({id: user._id, purchaseHistory: user.purchaseHistory});
		});
	})
	.then(function() {
		console.log(typeof(allUsers[0]));
		allUsers.sort(compareFunc);
		allUsers = allUsers.slice(0, allUsers.length - 10);
		console.log(gamesNotInCommon);
		return Game.find({_id: {$in: gamesNotInCommon}});
	})
	.then(function(games) {
		console.log(games);
		games.sort(compareGameFunc);
		return gamesNotInCommon;
	});
};

module.exports = getRecommendations;





