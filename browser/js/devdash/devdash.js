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
	$scope.newGame = {}
	var updateUser = function() {
		User.getOne(user._id).then(function(dev) {
			console.log(dev.createdGames)
			$scope.user = dev;
		});
	}
	updateUser();

	// var Game = function(title, description, genre, screenshots, minPrice){
	// 	this.title = title;
	// 	this.description = description;
	// 	this.genre = genre;
	// 	this.screenshots = screenshots;
	// 	this.minPrice = minPrice;
	// 	this.developer = user._id
	// }

	$scope.postGame = function(){
		// console.log("hi")
		// var thisGame = new Game(newGame)
		// $scope.newGame.developer = user._id
		User.postGame(user._id, $scope.newGame)
		.then(function() {
			// $scope.user = user;

		});
		updateUser();
		// $scope.user.createdGames.unshift(thisGame)
	}
});