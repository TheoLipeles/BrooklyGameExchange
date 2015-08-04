app.factory('User', function ($http) {
	return {

		getAll: function(){
			return $http.get('/api/users')
			.then(function(users){
				return users.data;
			});
		},

		getOne: function(id){
			return $http.get('/api/users/'+ id)
			.then(function(user){
				return user.data;
			});
		},

		deleteUser: function(id){
			return $http.delete('/api/users/' + id)
			.then(function(deletedUser){
				return deletedUser.data;
			});
		},

		getGames: function(id) {
			return $http.get('/api/users/'+ id + '/games')
			.then(function(games){
				return games.data;
			});
		},

		getReviews: function(id) {
			return $http.get('/api/users/'+ id + '/reviews')
			.then(function(games){
				return games.data;
			});
		},

		newUser: function(user) {
			return $http.post('/api/users/', user)
			.then(function(newUser){
				return newUser.data;
			})
			.then(null, function(err){
				console.log("There was an error", err);
			});
		},

		postGame: function(id, game) {
			return $http.post('/api/users/'+ id + '/games', game)
			.then(function(savedGame){
				console.log(savedGame)
				return savedGame.data;
			});
		},

		postReview: function(id, review) {
			return $http.post('/api/users/'+ id + '/reviews', review)
			.then(function(savedReview){
				console.log("review saved:",savedReview)
				return savedReview.data;
			});
		},

		getAllDevelopers: function(){
			return $http.get('/api/users/developers')
			.then(function(developers){
				return developers.data;
			});
		},

		buyGames: function(id, games) {
			var justGame = games.map(function(elem){
				return elem.game._id}
				)
			return $http.post('/api/users/'+id+'/checkout', justGame)
			.then(function(games){
				return games.data;
			});
		},

		getRecommendations: function(id) {
			return $http.get('/api/users/' + id + '/recommended')
			.then(function(games) {
				return games.data;
			});
		}

	};

});