var mongoose = require("mongoose");
var Promise = require('bluebird');
// var Bucket = Promise.promisifyAll(mongoose.model('Bucket'));
// var Action = Promise.promisifyAll(mongoose.model('Action'));
var User = Promise.promisifyAll(mongoose.model('User'));

var getRecommendations = function(id, actions) {
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
		return gameRecommendationValue(a) - gameRecommendationValue(b);
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
		allUsers = allUsers.slice(0, allUsers.length - 10);
		gamesNotInCommon.sort(compareGameFunc);
		return gamesNotInCommon;
	});
};

module.exports = getRecommendations;





