app.directive('navbar', function ($rootScope, AuthService, AUTH_EVENTS, $state) {

    return {
        restrict: 'E',
        scope: {},
        templateUrl: 'js/common/directives/navbar/navbar.html',
        link: function (scope) {

            scope.isLoggedIn = function () {
                return AuthService.isAuthenticated();
            };

            scope.items = [
                { label: 'HOME', state: 'home'},
                { label: 'BROWSE GAMES', state: 'browse'},
                { label: 'BROWSE DEVELOPERS', state: 'developers'},
                { label: 'MY PROFILE', state: 'profile({id: user._id})'},
                { label: 'DEV -BOARD', state: 'dash'},
                { label: 'ADMIN -BOARD', state: 'user'}
            ];

            scope.user = null;

            scope.isAdmin = function() {
                return AuthService.isAdmin();
            };

            scope.isDev = function() {
                return AuthService.isDev();
            };

            scope.logout = function () {
                AuthService.logout().then(function () {
                   $state.go('home');
                });
            };

            var setUser = function () {
                AuthService.getLoggedInUser().then(function (user) {
                    scope.user = user;
                });
            };

            var removeUser = function () {
                scope.user = null;
            };

            setUser();

            $rootScope.$on(AUTH_EVENTS.loginSuccess, setUser);
            $rootScope.$on(AUTH_EVENTS.logoutSuccess, removeUser);
            $rootScope.$on(AUTH_EVENTS.sessionTimeout, removeUser);

        }

    };

});
