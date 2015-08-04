app.config(function ($stateProvider) {

	$stateProvider.state('confirm', {
		url: '/confirm',
		params: {cart: null, total: null},
		templateUrl: 'js/confirm/confirm.html',
		controller: 'ConfirmCtrl',
		resolve: {
			user: function(AuthService){return AuthService.getLoggedInUser()}
		}
	});

});


app.controller('ConfirmCtrl', function($scope, $stateParams,$state,Games,user){
	$scope.user = user;

	console.log("params",$stateParams)

	$scope.cart = $stateParams.cart;

	$scope.total = function(){
		return $stateParams.total();
	}

	$scope.plural = function(){
		if ($scope.cart.length > 1) return "s";
		else return;
	}

	$scope.okay = function(){
		console.log("hey")
		Games.removeAllFromCart()
		$state.go('home');
	}

})