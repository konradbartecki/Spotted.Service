angular.module('core')
    .controller('headerController', ['$scope', 'userService', '$window', '$state', function($scope, userService, $window, $state) {

        $scope.user = userService.user;

        $scope.logout = function () {
            $window.localStorage.removeItem('token');
            $scope.user = false;
        }

    }]);
