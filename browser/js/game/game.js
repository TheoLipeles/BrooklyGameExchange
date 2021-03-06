app.config(function ($stateProvider) {

	$stateProvider.state('agame', {
		url: '/game/:id',
		templateUrl: 'js/game/game.html',
		controller: 'GameCtrl',
		resolve: {
			user: function(AuthService) {return AuthService.getLoggedInUser()}
		}
	});
});

app.controller('GameCtrl', function ($scope, $stateParams, Games, AuthService, User, user, $state){
	$scope.user = user;
	$scope.newReview = {};
	$scope._ = _;

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
		$scope.avgRatingGame = Math.floor(revSum / $scope.reviews.length) || 0;
	};

	$scope.updateReviews();

	$scope.reset = function() {
		$scope.newReview = {};
	};

	$scope.postReview = function(){
		//this should be in the resolve of the state but I couldn't get it to work
		AuthService.getLoggedInUser().then(function(user){
			User.postReview(user._id, $scope.newReview)
			.then(function(){
				$scope.updateReviews();
				$scope.reset();
			});
		});

	};

	$scope.deleteGame = function(id) {
		Games.deleteGame(id)
		.then(function(deletedGame){
			$state.go('browse');
		});
	};

});

app.controller('ModalInstanceCtrl', function ($scope, $modalInstance, Games, $stateParams, $cookies, AuthService) {
	$scope.game = {};
	$scope.loggedIn = AuthService.isAuthenticated();

	Games.getOne($stateParams.id)
	.then(function(game){
		$scope.thisGame = game;
		$scope.game.price = $scope.thisGame.minPrice;

	})
	.catch(function(err){
		console.log('error', err);
	});

	$scope.ok = function(){
		if ($scope.loggedIn) {
			Games.addToCart($stateParams.id, $scope.game.finalPrice)
			.then(function() {
				$modalInstance.dismiss();
			});
		} else {
			var cart = $cookies.get('cart');
			if (!cart) {
				cart = [{game: $stateParams.id, price: $scope.game.finalPrice}];
			} else {
				cart = JSON.parse(cart);
				cart.push({game: $stateParams.id, price: $scope.game.finalPrice});
				console.log(cart);
			}
			$cookies.put('cart', JSON.stringify(cart));
			$modalInstance.dismiss();
		}
	};


	$scope.cancel = function () {
		$modalInstance.dismiss('cancel');
	};


});


app.controller('ModalCtrl', function ($scope, $modal, $log) {

	//$scope.animationsEnabled = true;

	$scope.open = function (size) {

		var modalInstance = $modal.open({
			animation: true,
			templateUrl: 'js/game/myModalContent.html',
			controller: 'ModalInstanceCtrl',
			size: size
			//^^mean class="modal-sm"
		});

		modalInstance.result.then(function (selectedItem) {
			$log.info('Modal dismissed at: ' + new Date());
		});
	};  



});

// Please note that $modalInstance represents a modal window (instance) dependency.
// It is not the same as the $modal service used above.







