app.config(function ($stateProvider) {
    $stateProvider.state('home', {
        url: '/',
        templateUrl: 'js/home/home.html',
        resolve: {
        	user: function(AuthService){
        		return AuthService.getLoggedInUser()
        	}
        },
        controller: function($rootScope,user,$scope){
        	$scope.user = user;
        	console.log(user)
        	$rootScope.showNavBar = true;
        }
    });
});
