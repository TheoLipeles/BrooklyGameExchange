app.factory('Games', function ($http) {
	return {

		getAll: function(){
			return $http.get('/api/games')
			.then(function(games){
				return games.data
			});	
		},

		getOne: function(id){
			return $http.get('/api/games/'+id)
			.then(function(game){
				//I AM MAKING THIS [0] FOR NOW BUT WHEN IT BREAKS, GO LOOK AT THE ROUTES 
				return game.data[0]
			});
		}

		}
})