app.config(function ($stateProvider) {

    $stateProvider.state('browse', {
        url: '/browse',
        templateUrl: 'js/browse/browse.html',
        controller: 'BrowseCtrl'
    });

});



app.controller('BrowseCtrl', function ($scope,$state,Games){

	Games.getAll()
	.then(function(games){
		$scope.gamesList = games;
	})
	.catch(function(err){
		console.log('error',error)
	});

	$scope.game = Games.getOne();

})