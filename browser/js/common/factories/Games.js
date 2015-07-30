app.factory('Games', function ($http, AuthService) {
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
				return game.data
			});
		},

		addToCart: function(id, price) {
			return AuthService.getLoggedInUser(false)
			.then(function(user) {
				return $http.post('/api/users/' + user._id + '/cart/' , {id: id, price: price})
			});
		}

	}
})