/*

This seed file is only a placeholder. It should be expanded and altered
to fit the development of your application.

It uses the same file the server uses to establish
the database connection:
--- server/db/index.js

The name of the database used is set in your environment files:
--- server/env/*

This seed file has a safety check to see if you already have users
in the database. If you are developing multiple applications with the
fsg scaffolding, keep in mind that fsg always uses the same database
name in the environment files.

*/

var mongoose = require('mongoose');
var Promise = require('bluebird');
var chalk = require('chalk');
var connectToDb = require('./server/db');
var User = Promise.promisifyAll(mongoose.model('User'));
var Game = Promise.promisifyAll(mongoose.model('Game'));
var http = require("http");


var seedUsers = function () {

    var users = [
        {
            email: 'testing@fsa.com',
            password: 'password'
        },
        {
            email: 'obama@gmail.com',
            password: 'potus'
        }
    ];

    return User.createAsync(users);

};

var seedGames = function() {

    var games = [
        {
            title: 'Tetris',
            description: 'falling blocks and such',
            screenshots: ["http://web-vassets.ea.com/Assets/Richmedia/Image/Screenshots/tetris-mobile-screenshot-2_656x369.jpg?cb=1412974779",
            "http://www.fractalise.com/wp-content/uploads/2014/12/blog_img_tet1.jpg"],
            price: 3,
            downloads: 40
        },
        {
            title: 'Mario',
            description: 'a plumber on a mission',
            screenshots: ["http://wallpaperput.com/wp-content/uploads/2014/10/super-mario-game-best-HD-wallpaper.jpg",
            "http://www.soundonsight.org/wp-content/uploads/2014/06/Super-Mario-Bros.-3.jpg"],
            price: 3,
            downloads: 420
        },
        {
            title: 'Zelda',
            description: 'a boy in a hat',
            screenshots: ["http://img.gamefaqs.net/screens/7/6/2/gfs_29025_2_9.jpg"],
            price: 3,
            downloads: 49
        }
    ];


    return Game.createAsync(games);

};

connectToDb
.then(function () {
    User.findAsync({}).then(function (users) {

        if (users.length === 0) {
            return seedUsers();
        } else {
            console.log(chalk.magenta('Seems to already be user data, going to games!'));
            return;
        }
    })
    .then(function () {
        console.log("this works");
        return Game.findAsync({}).then(function (games) {
            console.log("this doesn't work?");
            if (games.length === 0) {
                return seedGames();
            } else{
                console.log(chalk.magenta('Seems to already be game data, exiting!'));
                process.kill(0);
            }
        });
    })
    .then(function () {
        console.log(chalk.green('Seed successful!'));
        process.kill(0);
    }).catch(function (err) {
        console.error(err);
        process.kill(1);
    });
}
);
