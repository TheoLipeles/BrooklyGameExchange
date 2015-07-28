app.config(function ($stateProvider) {

    $stateProvider.state('developers', {
        url: '/developers',
        templateUrl: 'js/developers/developers.html',
        controller: 'DeveloperCtrl'
    });

});



app.controller('DeveloperCtrl', function ($scope, $state, User){

	User.getAll()
	.then(function(users){
		$scope.allUsers = users;
	})
	.catch(function(err){
		console.log('error',error)
	});

	$scope.developers = $scope.allUsers.filter(function(element) {
		return element.isDev;
	});

})