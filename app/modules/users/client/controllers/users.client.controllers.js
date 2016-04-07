angular.module('users')

    .controller('usersController',
        function($scope, USER_SERVICE) {

            USER_SERVICE.getCurrentUser().then(function(response) {
                $scope.currentUser = response;
            });

        })

    .controller('usersPostsController',
        function($scope, USER_SERVICE) {

            USER_SERVICE.getUserPosts().then(function(response) {
                $scope.userPosts = response;
            });

        })

    .controller('usersSettingsController',
        function($scope, USER_SERVICE) {

            $scope.changePassword = function(data) {
                USER_SERVICE.changePassword(data);
            };

            $scope.changePicture = function(data) {
                USER_SERVICE.changePicture(data);
            };

        });

