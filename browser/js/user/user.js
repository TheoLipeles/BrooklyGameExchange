app.config(function ($stateProvider) {
    $stateProvider.state('user', {
        url: '/user',
        templateUrl: '/js/user/admin.html',
        controller: 'UserCtrl',
        // The following data.authenticate is read by an event listener
        // that controls access to this state. Refer to app.js.
        data: {
            authenticate: true
        },
        resolve: {
            admin: function(AuthService){return AuthService.getLoggedInUser()},
            users: function(User) {return User.getAll()}
        }
    });

    $stateProvider.state('profile', {
        url: '/user/:id',
        templateUrl: '/js/user/profile.html',
        controller: 'UserProfileCtrl',
    });

});

app.controller("UserCtrl", function($scope, User, Games, admin, users){
    $scope.users = users;

    $scope.deleteUser = function(id) {
        User.deleteUser(id)
        .then(function(deletedUser){
            $scope.users = $scope.users.filter(function(user){
                return user._id !== deletedUser._id;
            });
        });
    };

});

app.controller("UserProfileCtrl", function($scope, $stateParams, User, AuthService){
    User.getOne($stateParams.id)
    .then(function(user){
        $scope.user = user;
        $scope.id = $stateParams.id;
        return User.getRecommendations($stateParams.id);
    })
    .then(function(games) {
        console.log("games", games);
        $scope.user.recommendations = games;
    })
    .then(null, function(err){
        console.log(err);
    });

    User.getGames($stateParams.id)
    .then(function(games){
        $scope.games = games;
    })
    .then(null, function(err){
        console.log(err);
    });

    


    AuthService.getLoggedInUser()
    .then(function(loggedInUser){
        $scope.isAdmin = loggedInUser.isAdmin;
    });
});
