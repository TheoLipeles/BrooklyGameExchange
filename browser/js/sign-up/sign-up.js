app.config(function ($stateProvider) {
    $stateProvider.state('signup', {
        url: '/sign-up',
        templateUrl: '/js/sign-up/sign-up.html',
        controller: 'signupCtrl'
    });
});

app.controller('signupCtrl', function($scope, User, AuthService, $state){
    $scope.user = {};

    $scope.isDev = function(dev){
        $scope.user.isDev = !dev
    };

    $scope.devStatus = function(){
        if ($scope.user.isDev) return "Yes!";
        else return "No!";
    };

    $scope.reset = function() {
        $scope.user = {
            name: null,
            email: null,
            password: null,
            isDev: false
        };
    }

    $scope.newUser = function(user) {
        User.newUser(user)
        .then(function(newUser){
            $state.go('login', {'login.email': newUser.email});
        })
    }
});