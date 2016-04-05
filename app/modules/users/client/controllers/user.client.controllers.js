angular.module('users')

    .controller('userController',
        function($scope, USER_SERVICE) {
            USER_SERVICE.getCurrentUser().then(function(response) {
                $scope.currentUser = response;
            });
        })

    .controller('userPostsController', function($scope, USER_SERVICE) {

        $scope.getUserPosts = function(id) {
            USER_SERVICE.getUserPosts(id).then(function(response) {
                $scope.userPosts = response;
                console.log(response);
            });
        };

    })

    .controller('userGroupsController', function($scope, USER_SERVICE) {

        USER_SERVICE.getUserGroups().then(function(response) {
            $scope.userGroups = response;
        });

    })

    .controller('userSettingsController', function($scope, USER_SERVICE) {

        $scope.changePassword = function(credentials) {
            USER_SERVICE.changePassword(credentials);
        };

        $scope.changePicture = function(credentials) {
            USER_SERVICE.changePicture(credentials);
        };

    });

