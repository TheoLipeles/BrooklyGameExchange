app.config(function ($stateProvider) {

	$stateProvider.state('cart', {
		url: 'user/:id/cart',
		templateUrl: 'js/cart/cart.html',
		controller: 'CartCtrl'
	});

});

app.controller('CartCtrl', function ($scope, $stateParams){

	// Users.getOne($stateParams.id)
	// .then(function(user) {
	// 	$scope.name = user.name;
	// 	$scope.cart = user.cart;
	// })



})