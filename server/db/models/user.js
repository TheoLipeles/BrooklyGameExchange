'use strict';
var crypto = require('crypto');
var mongoose = require('mongoose');

var schema = new mongoose.Schema({
    name: {
        type: String,
        default: "BGX-er"
    },
    photo: {
        type: String,
        default: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Video_game_controller_icon_designed_by_Maico_Amorim.svg/1249px-Video_game_controller_icon_designed_by_Maico_Amorim.svg.png'
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    salt: {
        type: String
    },
    purchaseHistory: {
        type: [{type: mongoose.Schema.ObjectId, ref:"Game"}]
    },
    reviews: {
        type: [{type: mongoose.Schema.ObjectId, ref:"Review"}]
    },
    cart: {
        type: [{
            game: {type: mongoose.Schema.ObjectId, ref:"Game"}, price: {type: Number}}]
    },
    isDev: {
        type: Boolean,
        default: false
    },
    createdGames: {
        type: [{type: mongoose.Schema.ObjectId, ref:"Game"}]
    },
    twitter: {
        id: String,
        username: String,
        token: String,
        tokenSecret: String
    },
    facebook: {
        id: String
    },
    google: {
        id: String
    }
});

// generateSalt, encryptPassword and the pre 'save' and 'correctPassword' operations
// are all used for local authentication security.
var generateSalt = function () {
    return crypto.randomBytes(16).toString('base64');
};

var encryptPassword = function (plainText, salt) {
    var hash = crypto.createHash('sha1');
    hash.update(plainText);
    hash.update(salt);
    return hash.digest('hex');
};

schema.pre('save', function (next) {

    if (this.isModified('password')) {
        this.salt = this.constructor.generateSalt();
        this.password = this.constructor.encryptPassword(this.password, this.salt);
    }

    next();

});

schema.statics.generateSalt = generateSalt;
schema.statics.encryptPassword = encryptPassword;

schema.method('correctPassword', function (candidatePassword) {
    return encryptPassword(candidatePassword, this.salt) === this.password;
});

var User = mongoose.model('User', schema);
module.exports = User;