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
				return game.data
			});
		},

		getReviews: function(id){
			return $http.get('/api/games/'+id+'/reviews')
			.then(function(review){
				console.log(review.data)
				return review.data
			});
		}


		}
})