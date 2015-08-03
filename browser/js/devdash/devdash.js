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
	$scope.user = user;
	$scope.newGame = {};
	var updateUser = function() {
		User.getOne(user._id).then(function(dev) {
			console.log(dev.createdGames);
			$scope.user = dev;
		});
	};

	$scope.totalDownloads = function() {
		return user.createdGames.reduce(function(prev, game){
			return prev + game.downloads
		}, 0);
	}

	updateUser();

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