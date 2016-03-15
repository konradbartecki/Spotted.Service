angular.module('core')
    .controller('headerController', ['$scope', 'userService', function($scope, userService) {

        $scope.user = userService.user;

    }]);
