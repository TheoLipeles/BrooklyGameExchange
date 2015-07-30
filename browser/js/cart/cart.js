app.config(function ($stateProvider) {

	$stateProvider.state('cart', {
		url: 'user/:id',
		// templateUrl: 'js/cart/cart.html',
		templateUrl: 'js/user/user.html',
		controller: 'UserCtrl'
	});

});

app.controller('CartCtrl', function ($scope, $stateParams, Games, Users){

	Users.getOne($stateParams.id)
	.then(function(user) {
		$scope.name = user.name;
		$scope.cart = user.cart;
	})



})