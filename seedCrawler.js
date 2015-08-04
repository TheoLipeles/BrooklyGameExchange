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
			});
			
			http.get(url.slice(0, url.length - 9), function(res) {
				var reviews = "";
				res.on("data", function(chunk) {
					reviews += chunk;
				});
				res.on("end", function() {
					reviews = JSON.parse(reviews);
					game.downloadLink = "http://" + reviews.d1 + "" + reviews.dir + "/" + url.match(/metadata\/msdos_(.*)\/metadata/)[1] + ".zip";
					Game.create(game).then(function(game) {
						parseReviews(reviews.reviews, game);
					});
				});
			});
		});
});

var makeDeveloperIfNonExistent = function(name) {
	return User.findById({name: name})
	.then(function(dev) {
		game.developer = dev._id;
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

var parseReviews = function(reviews, game) {
	if (reviews) {
		async.map(reviews.slice(0, 10), function(review, cb) {
			makeUserIfNonExistent(review.reviewer).then(function(user) {
				review.author = user._id;
				cb(null, {
					title: review.reviewtitle,
					text: review.reviewbody,
					rating: review.stars,
					author: review.author,
					game: game._id
				});
			});
			
		}, function(err, reviews) {

				// var reviewIds = [];
				// var reviewsQueue = async.queue(saveReview, 10);
				// reviewsQueue.drain = function() {
				// 	console.log("reviews saved");
				// 	game.reviews = reviewIds;
				// 	done(game);
				// };

				Review.create(reviews).then(function(reviews) {
				// for (var review = 0; review < reviews.length; review++) {
				// 	var currentReview = reviews[review];
				// 	reviewIds.push(currentReview._id);
				// }
			});
			});
	}
};

var done = function(game) {
};

};

var urls = [{"identifier":"msdos_Universe_1987"},{"identifier":"msdos_Death_Bringer_1988"},{"identifier":"msdos_Racter_1984"},{"identifier":"msdos_Floatris_1993"},{"identifier":"msdos_Interphase_1989"},{"identifier":"msdos_Gravity_Force_2000_2000"},{"identifier":"msdos_Evolution_1983"},{"identifier":"msdos_The_Grandest_Fleet_1994"},{"identifier":"msdos_Blind_Wars_1992"},{"identifier":"msdos_Spirit_of_Excalibur_1990"},{"identifier":"msdos_International_Soccer_Challenge_1990"},{"identifier":"msdos_StarMines_1991"},{"identifier":"msdos_Realms_of_Chaos_1995"},{"identifier":"msdos_Spiritual_Warfare_1993"},{"identifier":"msdos_Ancient_Art_of_War_in_the_Skies_1992"},{"identifier":"msdos_Surf_Ninjas_1994"},{"identifier":"msdos_Roadwar_Europe_1987"},{"identifier":"msdos_Fatman_-_The_Caped_Consumer_1994"},{"identifier":"msdos_Uridium_1988"},{"identifier":"msdos_Risk_1986"},{"identifier":"msdos_Computer_Diplomacy_1984"},{"identifier":"msdos_Trivial_Pursuit_1987"},{"identifier":"msdos_Buck_Rogers_-_Planet_of_Zoom_1984"},{"identifier":"msdos_Larn_1986"},{"identifier":"msdos_Microsoft_Decathlon_1982"},{"identifier":"msdos_Operation_Body_Count_1994"},{"identifier":"msdos_See_the_U.S.A._1987"},{"identifier":"msdos_Psycho_1988"},{"identifier":"msdos_3DCube_1994"},{"identifier":"msdos_Legend_of_Faerghail_1990"},{"identifier":"msdos_Superman_-_The_Man_of_Steel_1989"},{"identifier":"msdos_Bruce_Lee_Lives_1989"},{"identifier":"msdos_Acid_Tetris_1998"},{"identifier":"msdos_Die_Hard_1989"},{"identifier":"msdos_Gremlins_2_-_The_New_Batch_1990_1990"},{"identifier":"msdos_Fellowship_of_the_Ring_The_-_Part_1_1986"},{"identifier":"msdos_Black_Cauldron_The_1986"},{"identifier":"msdos_Spear_of_Destiny_1992"},{"identifier":"msdos_The_Lost_Episodes_of_Doom_1995"},{"identifier":"msdos_Great_Naval_Battles_Vol_I_-_North_Atlantic_1939-1943_1992"},{"identifier":"msdos_Ishar_-_Legend_of_the_Fortress_1992"},{"identifier":"msdos_donald_ducks_playground_1984_sierra"},{"identifier":"msdos_Where_in_the_USA_is_Carmen_Sandiego_Enhanced_1992"},{"identifier":"msdos_Marble_Madness_1986"},{"identifier":"msdos_sokoban_1984_spectrum_holobyte"},{"identifier":"msdos_Invaders_1978_1996"},{"identifier":"msdos_Liero_1999"},{"identifier":"msdos_Death_Knights_of_Krynn_1991"},{"identifier":"msdos_Falcon_3.0_1991"},{"identifier":"msdos_Brokeout_1989"},{"identifier":"msdos_Clash_of_Steel_-_World_War_2_-_Europe_1939-45_1993"},{"identifier":"msdos_RoboCop_1989"},{"identifier":"msdos_Pacific_Strike_1994"},{"identifier":"msdos_Number_Munchers_1990"},{"identifier":"msdos_3D_Lemmings_Winterland_1995"},{"identifier":"msdos_Karateka_1986"},{"identifier":"msdos_Advanced_Tactical_Air_Command_1992_Microprose_Software_Inc"},{"identifier":"msdos_3D_Bomber_1998"},{"identifier":"msdos_WWII_-_Battles_of_the_South_Pacific_1993"},{"identifier":"msdos_A2_-_The_Ultimate_Sequel_To_AUTS_-_The_Ultimate_Stress_Relief_Game_1998"},{"identifier":"msdos_Alien_Cabal_1997"},{"identifier":"msdos_Times_of_Lore_1988"},{"identifier":"msdos_Premier_Manager_1992"},{"identifier":"msdos_LEmpereur_1991"},{"identifier":"msdos_Championship_Manager_2_-_Italian_Leagues_1996"},{"identifier":"msdos_Sid_and_Als_Incredible_Toons_1993"},{"identifier":"msdos_Hard_Hat_Mack_1984"},{"identifier":"msdos_Bob_Saget_Killer_2000_1997"},{"identifier":"msdos_Eagle_Eye_Mysteries_1993"},{"identifier":"msdos_Alice_in_Wonderland_1989"},{"identifier":"msdos_Last_Ninja_2_-_Back_with_a_Vengeance_1990"},{"identifier":"msdos_AMs_Mini_Golf_3D_1996"},{"identifier":"msdos_The_Adventures_of_Tintin_-_Prisoners_of_the_Sun_1997"},{"identifier":"msdos_Classic_Concentration_-_2nd_Edition_1989"},{"identifier":"msdos_Waynes_World_1993"},{"identifier":"msdos_Classic_Concentration_1988"},{"identifier":"msdos_Once_Upon_a_Forest_1995"},{"identifier":"msdos_Zaxxon_1984"},{"identifier":"msdos_Burger_Blaster_1988"},{"identifier":"msdos_Rise_of_the_Triad_-_The_Hunt_Begins_Deluxe_Edition_1995"},{"identifier":"msdos_DanDolme"},{"identifier":"msdos_Dig_Dug_1983"},{"identifier":"msdos_1_Ton_1996"},{"identifier":"msdos_Tongue_of_the_Fatman_1989"},{"identifier":"msdos_Cool_World_1992"},{"identifier":"msdos_Phrase_Master_1990"},{"identifier":"msdos_Will_Harveys_Music_Construction_Set_1984"},{"identifier":"msdos_Hera_-_Sword_of_Rhin_1995"},{"identifier":"msdos_Red_Lightning_1989"},{"identifier":"msdos_Wizard_of_Oz_1985"},{"identifier":"msdos_H.U.R.L._1995"},{"identifier":"msdos_SpaceKids_1996"},{"identifier":"msdos_Martian_Memorandum_1991"},{"identifier":"msdos_Apollo_18_Mission_to_the_Moon_1988"},{"identifier":"msdos_The_Rocketeer_1991"},{"identifier":"msdos_Wizball_1987"},{"identifier":"msdos_Dungeon_Quest_1985"},{"identifier":"msdos_Miner_2049er_1983"},{"identifier":"msdos_Great_Naval_Battles_Vol_II_-_Guadalcanal_1942-43_1994"},{"identifier":"msdos_Eojjeonji_Joheun_Il-i_Saenggil_Geot_Gateun_Jeonyeok_1997"}];

for (var i = 0; i < urls.length; i++) {
	getGame("http://archive.org/metadata/" + urls[i].identifier + "/metadata");
}
