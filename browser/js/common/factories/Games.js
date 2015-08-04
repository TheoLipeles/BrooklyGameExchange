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

		getReviews: function(id){
			return $http.get('/api/games/'+ id +'/reviews')
			.then(function(review){
				console.log(review.data);
				return review.data
			});
		},

		deleteGame: function(id){
			return $http.delete('/api/games/' + id)
			.then(function(game){
				console.log(game.data);
				return game.data;
			});
		},

		addToCart: function(id, price) {
			return AuthService.getLoggedInUser(false)
			.then(function(user) {
				return $http.post('/api/users/' + user._id + '/cart/' , {id: id, price: price})
			});
		},

		removeFromCart: function(itemId){
			return AuthService.getLoggedInUser(false)
			.then(function(user) {
				return $http.delete('/api/users/' + user._id + '/cart/' + itemId)
			});
		},

		removeAllFromCart: function(){
			return AuthService.getLoggedInUser(false)
			.then(function(user) {
				return $http.delete('/api/users/' + user._id + '/cart/')
			});
		},

		addDownloads: function(ids){
			return AuthService.getLoggedInUser(false)
			.then(function(user) {
				return $http.put('/api/games/'+user._id+'/addDownloads', {ids: ids})
			})
			.then(function(game){
				console.log('middle:', game.data)
				return game.data
			});
		}
	}




})