var http = require("http");
var mongoose = require('mongoose');
var Promise = require('bluebird');
var chalk = require('chalk');
var connectToDb = require('./server/db');
var User = Promise.promisifyAll(mongoose.model('User'));
var Game = Promise.promisifyAll(mongoose.model('Game'));
var Review = Promise.promisifyAll(mongoose.model('Review'));
var async = require("async");

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

	var saveReview = function(review, cb) {
		review.save();
		cb();
	};

	var parseReviews = function(reviews) {
		reviews = reviews.slice(0, 10).map(function(review) {
			console.log("maping reviews");
			return {
				title: review.reviewtitle,
				text: review.reviewbody,
				rating: review.stars
			};
		});
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
					console.log("saving review");
				});
			}
		});
	};

	var done = function(game) {
		Game.create(game).then(function(game) {
			console.log("game", game);
		});
	};

}

var urls = [{"identifier":"Episode24_20131231"},{"identifier":"Pikmin2TwoPlayerChallengeGreenHole"},{"identifier":"BetaClubFieldTrip-DoubleLunch"},{"identifier":"atari_2600_donkey_kong_1987_atari_cx26143"},{"identifier":"stillkinetix_mix_-_faxi_nadu_-_you_know_faxi_lp"},{"identifier":"EmptyMindsRadio14109-20-2013"},{"identifier":"supermarioworld-timeattack-star96-viper7"},{"identifier":"RetroCore_Volume32-The_Final"},{"identifier":"BtoadsandDD_Lee_2323"},{"identifier":"Retro_Core-Volume_28"},{"identifier":"TMNT4_Raph_hard_2231"},{"identifier":"MarioLostLevels_SS_Luigi_1725"},{"identifier":"Pikmin2TwoPlayerChallengeRedChasm"},{"identifier":"G2bep64"},{"identifier":"DonkeyKong64_SS_426"},{"identifier":"MegaManX3_SS_4439"},{"identifier":"Retro_Core_Volume_30"},{"identifier":"8bp038"},{"identifier":"MarioAllStars_Mario2_eu_SS_1117"},{"identifier":"Super_Mario_World_Overworld"},{"identifier":"RetroCore_Volume28"},{"identifier":"Necktar2017Volume2"},{"identifier":"ZeldaLttpGBA_SS_100p_21422"},{"identifier":"Retro_Core_Volume_31"},{"identifier":"MDSQ003"},{"identifier":"ChronoTrigger_100p_631"},{"identifier":"RetroCore-Summer-Special-2009-HD"},{"identifier":"PHAQVA05"},{"identifier":"LogosamphiaHowTo"},{"identifier":"H.p.SneakstepTheMetroidRenaissanceEp"},{"identifier":"ChameleonTwist_SS_100p_4300"},{"identifier":"PokemonAbridgedEpisode1"},{"identifier":"ElectronicRhythm"},{"identifier":"LP_New_Super_Mario_Bros_Wii"},{"identifier":"Halb_Automat_Tempo_Magic"},{"identifier":"20150715Kansasfest2015BurgerBeckyKeynote"},{"identifier":"ta2006-01-12"},{"identifier":"ZeldaWindWaker_708"},{"identifier":"arkanoid-timeattack-warpless-genisto"},{"identifier":"outofthisworld-timeattack-nitsuja"},{"identifier":"sg_Tecmo_Super_Bowl_III_Final_Edition_1995_Tecmo_US"},{"identifier":"3DSEmulator"},{"identifier":"m3d053-cheap-dirt-by-ds10-dominator"},{"identifier":"JAM-019"},{"identifier":"DentalWork-MentalSpaghetti"},{"identifier":"MetroidEchoes_17p_155"},{"identifier":"Longplay-SuperMarioBros2_NES"},{"identifier":"YouTubePokemonTheme"},{"identifier":"matter2006-04-28.sbd.flac16"},{"identifier":"RetroCore_Volume23"}];

for (var i = 0; i < urls.length; i++) {
	getGame("http://archive.org/metadata/" + urls[i].identifier + "/metadata");
}