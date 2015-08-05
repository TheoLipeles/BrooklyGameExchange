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
		for (var i = 0; i < recommender.purchaseHistory.length; i++) {
			if (userPurchaseHistory.indexOf(recommender.purchaseHistory[i]) !== -1) {
				totalInCommon++;
			} else if(gamesNotInCommon.indexOf(recommender.purchaseHistory[i]) === -1) {
				gamesNotInCommon.push(recommender.purchaseHistory[i]);
			}
		}
		return totalInCommon / (userPurchaseHistory.length + recommender.purchaseHistory.length - totalInCommon);
	};

	var compareFunc = function(a, b) {
		a.similarity = comparePurchaseHistory(a);
		b.similarity = comparePurchaseHistory(b);
		return b.similarity - a.similarity;
	};

	var gameRecommendationValue = function(game) {
		var totalInCommon = 0.00001;
		for (var i = 0; i < allUsers.length; i++) {
			if (allUsers[i].purchaseHistory.indexOf(game) !== -1) {
				totalInCommon += allUsers[i].similarity;
			}
		}
	};


	var compareGameFunc = function(a, b) {
		return gameRecommendationValue(b._id) - gameRecommendationValue(a._id);
	};

	return User.findById(id)
	.then(function(user) {
		userPurchaseHistory = user.purchaseHistory;
		return User.find({});
	})
	.then(function(users) {
		users.map(function(user) {
			allUsers.push({id: user._id, purchaseHistory: user.purchaseHistory});
		});
	})
	.then(function() {
		allUsers.sort(compareFunc);
		allUsers = allUsers.slice(0, 5);
		console.log(allUsers, gamesNotInCommon);
		return Game.find({_id: {$in: gamesNotInCommon}});
	})
	.then(function(games) {
		games.sort(compareGameFunc);
		return games;
	});
};

module.exports = getRecommendations;





