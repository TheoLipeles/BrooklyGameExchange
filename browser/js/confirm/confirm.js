app.config(function ($stateProvider) {

	$stateProvider.state('confirm', {
		url: '/confirm',
		params: {cart: null},
		templateUrl: 'js/confirm/confirm.html',
		controller: 'ConfirmCtrl',
		resolve: {
			user: function(AuthService){return AuthService.getLoggedInUser()}
		}
	});

});


app.controller('ConfirmCtrl', function($scope, $stateParams,$state){

	console.log($stateParams)
})