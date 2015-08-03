app.config(function ($stateProvider) {

	$stateProvider.state('cart', {
		url: '/user/:id/cart',
		templateUrl: '/js/cart/cart.html',
		controller: 'CartCtrl'
	});

});

app.controller('CartCtrl', function ($scope, $stateParams, User, Games){
	
	var getCart = function(){ 
		return User.getOne($stateParams.id)
		.then(function(user) {
			$scope.name = user.name;
			$scope.cart = user.cart || [];
		})
	};

	getCart();

	$scope.getTotal = function() {
		console.log("$scope.cart", $scope.cart);
		var total = 0;
		for(var i = 0; i < $scope.cart.length; i++) {
			total+=$scope.cart[i].price;
		}
		return total;
	};

	$scope.deleteItem = function(itemId){ 
		Games.removeFromCart(itemId)
		.then(function(){
			getCart();	
		});
	};


});