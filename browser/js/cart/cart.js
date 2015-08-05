app.config(function ($stateProvider) {

	$stateProvider.state('cart', {
		url: '/user/:id/cart',
		templateUrl: '/js/cart/cart.html',
		controller: 'CartCtrl'
	});

});

app.controller('CartCtrl', function ($scope, $stateParams, User, Games, $state, $cookies, AuthService){
	console.log($stateParams)

	$scope.signedIn = $stateParams.id.length > 0;

	console.log($scope.signedIn)

	var getCart = function(){
		console.log($scope.signedIn);
		if ($scope.signedIn) {
			return User.getOne($stateParams.id)
			.then(function(user) {
				$scope.name = user.name;
				$scope.cart = user.cart || [];
			}).then(null, function() {
				$scope.cart = [];
			});
		} else {
			$scope.cart = $cookies.get("cart");
			if ($scope.cart) {
					$scope.cart = JSON.parse($scope.cart);
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
			} else {
				$scope.cart = [];
			}
		}
	};

	getCart();

	$scope.getTotal = function() {
		console.log("$scope.cart", $scope.cart);
		var total = 0;
		for(var i = 0; i < $scope.cart.length; i++) {
			total += $scope.cart[i].price;
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
		if ($scope.signedIn) {
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