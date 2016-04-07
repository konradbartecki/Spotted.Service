angular.module('core')

    .controller('coreController',
        function($scope, $state, $rootScope, $window) {

            $scope.signOut = function() {
                $window.localStorage.removeItem('token');
                $rootScope.user = false;
                $rootScope.alerts = {
                    success: 'Poprawnie wylogowano z serwisu spotted. Zapraszamy ponownie!'
                };
                $state.go('home');
            };

        });
