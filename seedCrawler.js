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

User.remove({}, function(err) {
	console.log("collection cleared");
	var admins = [{name: "Admin1", email: "admin1", password: "password", isDev: true, isAdmin: true},
	{name: "Admin2", email: "admin2", password: "password", isDev: true, isAdmin: true},
	{name: "Admin3", email: "admin3", password: "password", isDev: true, isAdmin: true}];
	User.create(admins);
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
	    	if (body.description) {
		    	var possibleGenre = body.description.match(/<b>Genre<\/b>\s*(\w*)\s*<\/p>/);
		    	if (possibleGenre) {
			    	game.genre = possibleGenre[1];
			    	console.log(game.genre);
		    	}
	    	}
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
			    	reviews = JSON.parse(reviews);
			    	game.downloadLink = reviews.d1 + "" + reviews.dir + "/" + url.match(/metadata\/msdos_(.*)\/metadata/)[1] + ".zip";
			    	parseReviews(reviews.reviews);
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
				console.log("User exists", name);
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
					for (var review = 0; review < reviews.length; review++) {
						var currentReview = reviews[review];
						reviewsQueue.push(currentReview, function() {
							reviewIds.push(currentReview._id);
						});
					}
				});
			});
		}
	};

	var done = function(game) {
		Game.create(game).then(function(game) {
			User.findByIdAndUpdate(game.developer, {$push: {createdGames: game._id}}).then(function(){console.log("UPDATED DEV");});
			game.reviews.map(function(reviewId) {
				Review.findByIdAndUpdate(reviewId, {$set: {game: game._id}}).then(function(){console.log("UPDATED REVIEW");});
			});
		});
	};

}

var urls = [{"identifier":"msdos_Universe_1987"},{"identifier":"msdos_Death_Bringer_1988"},{"identifier":"msdos_Racter_1984"},{"identifier":"msdos_Floatris_1993"},{"identifier":"msdos_Interphase_1989"},{"identifier":"msdos_Gravity_Force_2000_2000"},{"identifier":"msdos_Evolution_1983"},{"identifier":"msdos_The_Grandest_Fleet_1994"},{"identifier":"msdos_Blind_Wars_1992"},{"identifier":"msdos_Spirit_of_Excalibur_1990"},{"identifier":"msdos_International_Soccer_Challenge_1990"},{"identifier":"msdos_DragonStrike_1990"},{"identifier":"msdos_StarMines_1991"},{"identifier":"msdos_Realms_of_Chaos_1995"},{"identifier":"msdos_Spiritual_Warfare_1993"},{"identifier":"msdos_Ancient_Art_of_War_in_the_Skies_1992"},{"identifier":"msdos_Surf_Ninjas_1994"},{"identifier":"msdos_Roadwar_Europe_1987"},{"identifier":"msdos_Fatman_-_The_Caped_Consumer_1994"},{"identifier":"msdos_Risk_1986"},{"identifier":"msdos_Uridium_1988"},{"identifier":"msdos_Computer_Diplomacy_1984"},{"identifier":"msdos_The_Playroom_1989"},{"identifier":"msdos_Trivial_Pursuit_1987"},{"identifier":"msdos_Buck_Rogers_-_Planet_of_Zoom_1984"},{"identifier":"msdos_Larn_1986"},{"identifier":"msdos_Microsoft_Decathlon_1982"},{"identifier":"msdos_Operation_Body_Count_1994"},{"identifier":"msdos_Adventures_of_Robin_Hood_The_1992"},{"identifier":"msdos_See_the_U.S.A._1987"},{"identifier":"msdos_Psycho_1988"},{"identifier":"msdos_3DCube_1994"},{"identifier":"msdos_Bedlam_2_-_Absolute_Bedlam_1997"},{"identifier":"msdos_Legend_of_Faerghail_1990"},{"identifier":"msdos_Superman_-_The_Man_of_Steel_1989"},{"identifier":"msdos_Bruce_Lee_Lives_1989"},{"identifier":"msdos_Acid_Tetris_1998"},{"identifier":"msdos_Die_Hard_1989"},{"identifier":"msdos_Gremlins_2_-_The_New_Batch_1990_1990"},{"identifier":"msdos_Fellowship_of_the_Ring_The_-_Part_1_1986"},{"identifier":"msdos_Black_Cauldron_The_1986"},{"identifier":"msdos_Spear_of_Destiny_1992"},{"identifier":"msdos_The_Lost_Episodes_of_Doom_1995"},{"identifier":"msdos_Great_Naval_Battles_Vol_I_-_North_Atlantic_1939-1943_1992"},{"identifier":"msdos_Beyond_Castle_Wolfenstein_1985"},{"identifier":"msdos_Ishar_-_Legend_of_the_Fortress_1992"},{"identifier":"msdos_sokoban_1984_spectrum_holobyte"},{"identifier":"msdos_donald_ducks_playground_1984_sierra"},{"identifier":"msdos_Where_in_the_USA_is_Carmen_Sandiego_Enhanced_1992"},{"identifier":"msdos_Marble_Madness_1986"}];

for (var i = 0; i < urls.length; i++) {
	getGame("http://archive.org/metadata/" + urls[i].identifier + "/metadata");
}

