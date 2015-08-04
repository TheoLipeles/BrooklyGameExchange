app.config(function ($stateProvider) {

	$stateProvider.state('cart', {
		url: '/user/:id/cart',
		templateUrl: '/js/cart/cart.html',
		controller: 'CartCtrl'
	});

});

app.controller('CartCtrl', function ($scope, $stateParams, User, Games, $state, $cookies, AuthService){
	

	var getCart = function(){
		if (AuthService.isAuthenticated()) {
			return User.getOne($stateParams.id)
			.then(function(user) {
				$scope.name = user.name;
				$scope.cart = user.cart || [];
			});
		} else {
			$scope.cart = JSON.parse($cookies.get("cart"));
			var setGame = function(game) {
				for (var i = 0; i < $scope.cart.length; i++) {
					if ($scope.cart[i].game == game._id) {
						$scope.cart[i].game = game;
					}
				}
			};
			for (var i = 0; i < $scope.cart.length; i++) {
				console.log($scope.cart[i], i);
				Games.getOne($scope.cart[i].game)
				.then(setGame);
			}
		}
	};

	getCart();

	$scope.getTotal = function() {
		// console.log("$scope.cart", $scope.cart);
		var total = 0;
		for(var i = 0; i < $scope.cart.length; i++) {
			total+=$scope.cart[i].price;
		}
		return total;
	};

	var updateCart = function() {
		$scope.cart = $scope.cart.map(function(item) {
			item.game = item.game._id;
			return item;
		});
		$cookies.put("cart", JSON.stringify($scope.cart));
	};

	$scope.deleteItem = function(itemId){
		if (AuthService.isAuthenticated()) {
			Games.removeFromCart(itemId)
			.then(function(){
				getCart();	
			});
		} else {
			for (var i = 0; i < $scope.cart.length; i++) {
				if ($scope.cart[i]._id == itemId) {
					$scope.cart.splice(i, 1);
					updateCart();
				}
			}
		}
	};

	$scope.checkOut = function(){
		console.log('cart:',$scope.cart);
		if (AuthService.isAuthenticated()) {
			User.buyGames($stateParams.id, $scope.cart)
			.then(function(games){
				$state.go('confirm', {cart: $scope.cart, total: $scope.getTotal});
				console.log("Bought",games);
			});
		} else {
			$state.go('login');
		}
	};

});