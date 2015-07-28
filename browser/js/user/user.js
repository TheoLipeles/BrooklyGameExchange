app.config(function ($stateProvider) {
    $stateProvider.state('user', {
        url: '/users/:id',
        templateUrl: '/js/user/user.html',
        controller: 'UserCtrl',
        // The following data.authenticate is read by an event listener
        // that controls access to this state. Refer to app.js.
        // data: {
        //     authenticate: true
        // }
    });
});

app.controller("UserCtrl", function($scope, $stateParams, User){
    User.getOne($stateParams.id)
    .then(function(user){
        $scope.User = user;
    })
    .then(null, function(err){
        console.log(err);
    });
});
