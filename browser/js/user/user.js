app.config(function ($stateProvider) {
    $stateProvider.state('user', {
        url: '/user',
        templateUrl: '/js/user/user.html',
        controller: 'UserCtrl',
        // The following data.authenticate is read by an event listener
        // that controls access to this state. Refer to app.js.
        data: {
            authenticate: true
        }
    });

    $stateProvider.state('profile', {
        url: '/user/:id',
        templateUrl: '/js/user/profile.html',
        controller: 'UserProfileCtrl',
    });

});

app.controller("UserCtrl", function($scope, User){
    User.getAll()
    .then(function(users){
        $scope.users = users;
    })
    .then(null, function(err){
        console.log(err);
    });
});

app.controller("UserProfileCtrl", function($scope, $stateParams, User){
    User.getOne($stateParams.id)
    .then(function(user){
        $scope.user = user;
        $scope.id = $stateParams.id;
    })
    .then(null, function(err){
        console.log(err);
    });

    // User.getGames($stateParams.id)
    // .then(function(games){
    //     $scope.games = games;
    // })
    // .then(null, function(err){
    //     console.log(err);
    // })
});
