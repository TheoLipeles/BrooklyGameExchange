app.config(function ($stateProvider) {

    $stateProvider.state('login', {
        url: '/login',
        templateUrl: 'js/login/login.html',
        controller: 'LoginCtrl'
    });

});

app.controller('LoginCtrl', function ($scope, AuthService, $state, Games, $cookies) {

    $scope.login = {};
    $scope.error = null;

    $scope.sendLogin = function (loginInfo) {

        $scope.error = null;

        AuthService.login(loginInfo).then(function (data) {
            $scope.cart = $cookies.get("cart");
            if ($scope.cart) {
                $scope.cart = JSON.parse($scope.cart);
                for (var i = 0; i < $scope.cart.length; i++) {
                    console.log($scope.cart[i].game, $scope.cart[i].price);
                    Games.addToCart($scope.cart[i].game, $scope.cart[i].price);
                }
                $cookies.remove('cart');
            }
            $state.go('profile', {id: data._id});
        }).catch(function () {
            $scope.error = 'Invalid login credentials.';
        });

    };

});