angular.module('core')

    .controller('coreController',
        function($scope, $rootScope, $state) {

        })

    .controller('headerController', ['$scope', '$state', '$window', '$rootScope',
        function($scope, $state, $window, $rootScope) {

            $scope.signout = function() {
                $window.localStorage.removeItem('token');
                $rootScope.user = false;
                $rootScope.alerts = {
                  success: 'Poprawnie wylogowano z serwisu spotted. Zapraszamy ponownie!'
                };
                $state.go('home');
            };

        }]);
