angular.module('comments')
    .controller('commentsController', ['$scope', '$rootScope', 'commentsFactory', function($scope, $rootScope, commentsFactory) {

        $scope.user = $rootScope.user.id;
        $scope.api = commentsFactory.api;

        console.log($scope.user);

    }])

    .controller('commentsCreateController', ['$scope', '$http', function($scope, $http) {

        $scope.comment = {};

        $scope.createComment = function(id) {

            $http({
                url: $scope.api.comments,
                method: 'POST',
                data: {
                    message: $scope.comment.message,
                    user: $scope.user,
                    post: id
                },
                headers: {
                    'x-access-token': $scope.token
                }
            }).then(function successCallback() {
                $scope.comment = {};
            });

        };

    }]);
