app.config(function ($stateProvider) {

	$stateProvider.state('agame', {
		url: '/game/:id',
		templateUrl: 'js/game/game.html',
		controller: 'GameCtrl'

	});

});

app.controller('GameCtrl', function ($scope,$stateParams,Games,AuthService,User){


	Games.getOne($stateParams.id)
	.then(function(game){
		$scope.thisGame = game;
		$scope.descriptionHTML = $scope.thisGame.description;
	})
	.catch(function(err){
		console.log('error', err);
	});

	Games.getReviews($stateParams.id)
	.then(function(reviews){
		// console.log(reviews)
		$scope.reviews = reviews;
	})
	.catch(function(err){
		console.log('error', err);
	});

	var Review = function(title, game, rating, text, author){
		this.title = title;
		this.game = game;
		this.rating = rating;
		this.text = text;
		this.author = author;
	};

	$scope.postReview = function(){
		//this should be in the resolve of the state but I couldn't get it to work
		AuthService.getLoggedInUser().then(function(user){
			// console.log(user)
			var newRev = new Review(
			$scope.newReview.title,
			$scope.thisGame._id,
			$scope.newReview.rating,
			$scope.newReview.text,
			user);
			$scope.reviews.unshift(newRev);

			User.postReview(user._id, newRev);
			
		});

	};

});

app.controller('ModalInstanceCtrl', function ($scope, $modalInstance, Games, $stateParams) {
	$scope.game = {};

	Games.getOne($stateParams.id)
	.then(function(game){
		$scope.thisGame = game;
		$scope.game.price = $scope.thisGame.minPrice;
	})
	.catch(function(err){
		console.log('error', err);
	});


	$scope.ok = function(){
		Games.addToCart($stateParams.id, $scope.game.price)
		.then(function() {
			$modalInstance.dismiss();
		});
	};


	$scope.cancel = function () {
		$modalInstance.dismiss('cancel');
	};


});


app.controller('ModalCtrl', function ($scope, $modal, $log) {

	$scope.animationsEnabled = true;

	$scope.open = function (size) {

		var modalInstance = $modal.open({
			animation: $scope.animationsEnabled,
			templateUrl: 'myModalContent.html',
			controller: 'ModalInstanceCtrl',
			size: size
		});

		modalInstance.result.then(function (selectedItem) {
			$log.info('Modal dismissed at: ' + new Date());
		});



	};  




	$scope.toggleAnimation = function () {
		$scope.animationsEnabled = !$scope.animationsEnabled;
	};

});

// Please note that $modalInstance represents a modal window (instance) dependency.
// It is not the same as the $modal service used above.







