angular.module('core')

    .controller('coreController', ['$scope', '$state', function($scope, $state) {

        $scope.state = $state;

        $scope.$watch('state.current.name', function(newValue) {
            $scope.currentState = newValue;
            if($scope.currentState == 'home') {
                $scope.isHome = true;
            } else {
                $scope.isHome = false;
            }
        });

    }])

    .controller('headerController', ['$scope', '$state', '$window', '$rootScope', '$uibModal',
        function($scope, $state, $window, $rootScope, $uibModal) {

            $scope.signout = function() {
                $window.localStorage.removeItem('token');
                $rootScope.user = false;
                $state.go('home');
            };

            $scope.openModalAuth = function(tpl) {
                var modalAuth = $uibModal.open({
                    animation: false,
                    templateUrl: 'app/modules/users/client/views/authentication/' + tpl + '/' + tpl + '.client.view.html',
                    controller: 'authController',
                    size: 'lg'
                });
            };

        }]);
