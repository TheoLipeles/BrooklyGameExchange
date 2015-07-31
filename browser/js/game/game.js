app.config(function ($stateProvider) {

    $stateProvider.state('agame', {
        url: '/game/:id',
        templateUrl: 'js/game/game.html',
        controller: 'GameCtrl'

    });

});

app.controller('GameCtrl', function ($scope,$stateParams,Games,AuthService,User){

	$scope.newReview = {}

	Games.getOne($stateParams.id)
	.then(function(game){
		$scope.thisGame = game;
		$scope.descriptionHTML = $scope.thisGame.description;
		$scope.newReview.game = game._id
	})
	.catch(function(err){
		console.log('error', err)
	});

	$scope.updateReviews = function(){
			Games.getReviews($stateParams.id)
		.then(function(reviews){
			// console.log(reviews)
			$scope.reviews = reviews;
		})
		.catch(function(err){
			console.log('error', err)
		});
	};
	$scope.updateReviews();

	// var Review = function(title, game, rating, text, author){
	// 	this.title = title;
	// 	this.game = game;
	// 	this.rating = rating;
	// 	this.text = text;
	// 	this.author = author;
	// }

	$scope.postReview = function(){
		//this should be in the resolve of the state but I couldn't get it to work
		AuthService.getLoggedInUser().then(function(user){
			// console.log(user)
			// var newRev = new Review(
			// $scope.newReview.title,
			// $scope.thisGame._id,
			// $scope.newReview.rating,
			// $scope.newReview.text,
			// user)
			// $scope.reviews.unshift(newRev);

			User.postReview(user._id, $scope.newReview)
			.then(function(){
				$scope.updateReviews();
			})
		})

	};


})