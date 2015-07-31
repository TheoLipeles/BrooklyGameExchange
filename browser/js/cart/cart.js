app.config(function ($stateProvider) {

	$stateProvider.state('cart', {
		url: 'user/:id/cart',
		templateUrl: 'js/cart/cart.html',
		controller: 'CartCtrl'
	});

});

app.controller('CartCtrl', function ($scope, $stateParams, User){

	User.getAll()
    .then(function(users){
        $scope.users = users;
    })
    .then(null, function(err){
        console.log(err);
    });

	// Users.getOne($stateParams.id)
	// .then(function(user) {
	// 	$scope.name = user.name;
	// 	$scope.cart = user.cart;
	// })



});