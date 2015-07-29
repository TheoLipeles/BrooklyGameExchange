app.config(function ($stateProvider) {
    $stateProvider.state('signup', {
        url: '/sign-up',
        templateUrl: '/js/sign-up/sign-up.html',
        controller: 'signupCtrl',
        // The following data.authenticate is read by an event listener
        // that controls access to this state. Refer to app.js.
        data: {
            authenticate: true
        }
    });
});

app.controller('signupCtrl', function($scope){
});