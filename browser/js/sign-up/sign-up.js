app.config(function ($stateProvider) {
    $stateProvider.state('signup', {
        url: '/sign-up',
        templateUrl: '/js/sign-up/sign-up.html',
        controller: 'signupCtrl'
    });

    $stateProvider.state('signup.developer', {
        url: '/developer',
        templateUrl: '/js/sign-up/sign-up.developer.html',
        controller: 'signupCtrl'
    });
});

app.controller('signupCtrl', function($scope, User){
    User.newUser();
});