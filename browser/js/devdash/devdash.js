app.config(function ($stateProvider) {

    $stateProvider.state('dash', {
        url: '/devdashboard',
        templateUrl: 'js/devdash/devdash.html',
        controller: 'DevDashCtrl',
        resolve: {
        	user: function(AuthService){return AuthService.getLoggedInUser()}

    	}
	});

});

app.controller('DevDashCtrl',function ($scope, User, user, AuthService){
	$scope._ = _;
	$scope.user = user;
	$scope.newGame = {
		screenshots: ['http://vignette3.wikia.nocookie.net/wowwiki/images/7/75/Captain_Placeholder.jpg/revision/latest?cb=20070324064719']
	};
	var updateUser = function() {
		User.getOne(user._id).then(function(dev) {
			$scope.user = dev;
		});
	};

	$scope.totalDownloads = function() {
		return user.createdGames.reduce(function(prev, game){
			return prev + game.downloads;
		}, 0) || 0;
	};

	var avgRatingDev = function(id) {
		User.getGames(id)
		.then(function(games){
			var devSum = 0;
			for (var i = 0; i < games.length; i ++){
				var game = games[i]
				var gameSum = 0;
				for (var j = 0; j < game.reviews.length; j++){
					console.log(game.reviews[j].rating);
					gameSum += game.reviews[j].rating;
				}
				var gameAvg = gameSum / game.reviews.length;
				devSum += gameAvg;
			}
			$scope.avgRating = Math.floor(devSum / games.length);
		});
	};

	updateUser();
	avgRatingDev($scope.user._id);

    $scope.reset = function() {
    	$scope.newGame = {
        	title: null,
        	description: null,
        	genre: null,
        	screenshot: false,
        	minPrice: null,
        	downloadLink: null
    	};
	};

	$scope.postGame = function(){
		User.postGame(user._id, $scope.newGame)
		.then(function() {
			updateUser();
			$scope.reset();
		});
	};

});