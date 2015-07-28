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
	})
	.catch(function(err){
		console.log('error',error)
	});




})