app.config(function ($stateProvider) {

    $stateProvider.state('agame', {
        url: '/game/:id',
        templateUrl: 'js/game/game.html',
        controller: 'GameCtrl'

    });

});

app.controller('GameCtrl', function ($scope,$stateParams,Games){

	Games.getOne($stateParams.id)
	.then(function(game){
		$scope.thisGame = game;
		$scope.descriptionHTML = $scope.thisGame.description;
	})
	.catch(function(err){
		console.log('error', err)
	});


	$scope.postReview = function(){
		console.log($scope.newReview)
	};


})