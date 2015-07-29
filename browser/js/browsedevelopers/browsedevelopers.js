app.config(function ($stateProvider) {

    $stateProvider.state('browsedevelopers', {
        url: '/browsedevelopers',
        templateUrl: 'js/browsedevelopers/browsedevelopers.html',
        controller: 'BrowseDevelopersCtrl'
    });

});



app.controller('BrowseDevelopersCtrl', function ($scope, $state, User){

	User.getAllDevelopers()
	.then(function(developers){
		$scope.Developers = developers;
	})
	.catch(function(err){
		console.log('error', err)
	});

})