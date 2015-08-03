app.factory('RandomGreetings', function () {

    var getRandomFromArray = function (arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    };

    var greetings = [
        'An Online Digital Marketplace for Indie Game Developers',
        'Video.....ARMAGEDDON!!!',
        'All Your Base Are Belong To Us',
        'You were almost a Nick sandwich',
        'Yo Dogg, I heard you like Facebook',
        'Now you\'re playing with power...',
        'Video Games',
        'Let\'s Play Games',
    ];

    return {
        greetings: greetings,
        getRandomGreeting: function () {
            return getRandomFromArray(greetings);
        }
    };

});
