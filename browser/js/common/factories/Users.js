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
				console.log(user);
				return user.data;
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

		postGame: function(id, game) {
			return $http.post('/api/users/'+ id + '/games', game)
			.then(function(savedGame){
				return savedGame.data;
			});
		},

		postReview: function(id, review) {
			return $http.post('/api/users/'+ id + '/reviews', review)
			.then(function(savedReview){
				return savedReview.data;
			});
		}
	};

});