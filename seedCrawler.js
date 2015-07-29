var http = require("http");
var mongoose = require('mongoose');
var Promise = require('bluebird');
var chalk = require('chalk');
var connectToDb = require('./server/db');
var User = Promise.promisifyAll(mongoose.model('User'));
var Game = Promise.promisifyAll(mongoose.model('Game'));
var Review = Promise.promisifyAll(mongoose.model('Review'));
var async = require("async");
var faker = require("faker");

Game.remove({}, function(err) {
	console.log("collection cleared");
});

Review.remove({}, function(err) {
	console.log("collection cleared");
});


function getGame(url) {
	var game = {};
	http.get(url, function(res) {
	    var body = "";
	    res.on("data", function(chunk) {
	    	body += chunk;
	    });
	    res.on("end", function() {
	    	body = JSON.parse(body).result;
	    	game.title = body.title;
	    	game.description = body.description;
	    	game.screenshots = ["http://archive.org/services/img/" + url.match(/metadata\/(.*)\/metadata/)[1]];
	    	makeDeveloperIfNonExistent(body.creator).then(function(dev) {
	    		game.developer = dev._id;
	    		dev.save();
	    	});
	    	http.get(url.slice(0, url.length - 9), function(res) {
	    		var reviews = "";
			    res.on("data", function(chunk) {
			    	reviews += chunk;
			    });
			    res.on("end", function() {
			    	reviews = JSON.parse(reviews).reviews;
			    	console.log(game);
			    	parseReviews(reviews);
	    		});
	    	});
		});
	});

	var makeDeveloperIfNonExistent = function(name) {
		return User.findById({name: name})
			.then(function(dev) {
				console.log("Developer exists", name);
			})
			.then(null, function() {
				return User.create({name: name, email: faker.internet.email(), password: "supersecurefakepassword", isDev: true});
			});
	};

	var makeUserIfNonExistent = function(name) {
		return User.findById({name: name})
			.then(function(dev) {
				console.log("Developer exists", name);
			})
			.then(null, function() {
				return User.create({name: name, email: faker.internet.email(), password: "supersecurefakepassword"});
			});
	};

	var saveReview = function(review, cb) {
		review.save();
		cb();
	};

	var parseReviews = function(reviews) {
		if (reviews) {
			async.map(reviews.slice(0, 1), function(review, cb) {
				console.log("maping reviews", review);
				makeUserIfNonExistent(review.reviewer).then(function(user) {
					review.author = user._id;
					user.save();
					cb(null, {
						title: review.reviewtitle,
						text: review.reviewbody,
						rating: review.stars,
						author: review.author
					});
				});
				
			}, function(err, reviews) {

				var reviewIds = [];
				var reviewsQueue = async.queue(saveReview, 10);
				reviewsQueue.drain = function() {
					console.log("reviews saved");
					game.reviews = reviewIds;
					done(game);
				};

				Review.create(reviews).then(function(reviews) {
					console.log("created reviews", reviews);
					for (var review = 0; review < reviews.length; review++) {
						var currentReview = reviews[review];
						reviewsQueue.push(currentReview, function() {
							reviewIds.push(currentReview._id);
							console.log("saving review", currentReview);
						});
					}
				});
			});
		}
	};

	var done = function(game) {
		Game.create(game).then(function(game) {
			console.log("game", game);
			User.findByIdAndUpdate(game.developer, {$push: {createdGames: game._id}}).then(function(){console.log("UPDATED DEV");});
			game.reviews.map(function(reviewId) {
				Review.findByIdAndUpdate(reviewId, {$set: {game: game._id}}).then(function(){console.log("UPDATED REVIEW");});
			});
		});
	};

}

var urls = [{"identifier":"msdos_Oregon_Trail_The_1990"},{"identifier":"msdos_Prince_of_Persia_1990"},{"identifier":"msdos_Wolfenstein_3D_1992"},{"identifier":"msdos_Oregon_Trail_Deluxe_The_1992"},{"identifier":"msdos_SimCity_1989"},{"identifier":"msdos_Super_Street_Fighter_II_1996"},{"identifier":"msdos_4D_Prince_of_Persia_1994"},{"identifier":"msdos_Pac-Man_1983"},{"identifier":"msdos_Stunts_1990"},{"identifier":"msdos_Disneys_Aladdin_1994"},{"identifier":"msdos_Prehistorik_2_1993"},{"identifier":"msdos_Street_Fighter_II_1992"},{"identifier":"msdos_Lemmings_2_-_The_Tribes_1993"},{"identifier":"msdos_Dune_2_-_The_Building_of_a_Dynasty_1992"},{"identifier":"msdos_Bust-A-Move_1997"},{"identifier":"msdos_Leisure_Suit_Larry_1_-_Land_of_the_Lounge_Lizards_1987"},{"identifier":"msdos_Donkey_Kong_1983"},{"identifier":"msdos_Ms._Pac-Man_1983"},{"identifier":"msdos_Castle_Wolfenstein_1984"},{"identifier":"msdos_Where_in_the_World_is_Carmen_Sandiego_Enhanced_1989"},{"identifier":"msdos_Centurion_-_Defender_of_Rome_1990"},{"identifier":"msdos_Indiana_Jones_and_The_Last_Crusade_1989"},{"identifier":"msdos_Golden_Axe_1990"},{"identifier":"msdos_Doom_-_The_Roguelike_2005"},{"identifier":"msdos_Street_Fighter_1988"},{"identifier":"msdos_Batman_Returns_1993"},{"identifier":"msdos_Softporn_II_1985"},{"identifier":"msdos_Mario_Brothers_VGA_1990"},{"identifier":"msdos_Scorched_Earth_1991"},{"identifier":"msdos_Maniac_Mansion_1987"},{"identifier":"msdos_Total_Carnage_1994"},{"identifier":"msdos_Crosscountry_Canada_1991"},{"identifier":"msdos_Test_Drive_III_The_Passion_1990"},{"identifier":"msdos_Where_in_the_World_is_Carmen_Sandiego_Deluxe_1990"},{"identifier":"msdos_Jazz_Jackrabbit_1994"},{"identifier":"msdos_Budokan_The_Martial_Spirit_1989"},{"identifier":"msdos_Disneys_Duck_Tales_-_The_Quest_for_Gold_1990"},{"identifier":"msdos_Duke_it_out_in_D.C._1997"},{"identifier":"msdos_Leisure_Suit_Larry_5_-_Passionate_Patti_Does_a_Little_Undercover_Work_1991"},{"identifier":"msdos_Deluxe_Ski_Jump_2000"},{"identifier":"msdos_Warlords_II_1993"},{"identifier":"msdos_SimAnt_-_The_Electronic_Ant_Colony_1991"},{"identifier":"msdos_Digger_1983_1983"},{"identifier":"msdos_3D_Bomber_1998"},{"identifier":"msdos_Lode_Runner_1983_1983"},{"identifier":"msdos_Alley_Cat_1984"},{"identifier":"msdos_Master_of_Orion_1993"},{"identifier":"msdos_Sex_Vixens_From_Space_1989"},{"identifier":"msdos_Star_Wars_1988"},{"identifier":"msdos_SimFarm_1993"}];

for (var i = 0; i < urls.length; i++) {
	getGame("http://archive.org/metadata/" + urls[i].identifier + "/metadata");
}