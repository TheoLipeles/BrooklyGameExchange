app.config(function ($stateProvider) {

	$stateProvider.state('agame', {
		url: '/game/:id',
		templateUrl: 'js/game/game.html',
		controller: 'GameCtrl'

	});

});

app.controller('GameCtrl', function ($scope, $stateParams, Games, AuthService, User){

	$scope.newReview = {};

	Games.getOne($stateParams.id)
	.then(function(game){
		$scope.thisGame = game;
		$scope.descriptionHTML = $scope.thisGame.description;
		$scope.newReview.game = game._id;
	})
	.catch(function(err){
		console.log('error', err);
	});

	$scope.updateReviews = function(){
		Games.getReviews($stateParams.id)
		.then(function(reviews){
			$scope.reviews = reviews;
			$scope.avgRatingRev();
		})
		.catch(function(err){
			console.log('error', err);
		});
	};

	$scope.avgRatingRev = function() {
		var revSum = 0;
		for (var i = 0; i < $scope.reviews.length; i++){
			revSum += parseInt($scope.reviews[i].rating);
		}
		$scope.avgRatingGame = Math.floor(revSum / $scope.reviews.length);
	};

	$scope.updateReviews();

	$scope.reset = function() {
		$scope.newReview = {};
	};

	$scope.postReview = function(){
		//this should be in the resolve of the state but I couldn't get it to work
		AuthService.getLoggedInUser().then(function(user){
			// console.log(user)

			User.postReview(user._id, $scope.newReview)
			.then(function(){
				$scope.updateReviews();
				$scope.reset();
			});
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







