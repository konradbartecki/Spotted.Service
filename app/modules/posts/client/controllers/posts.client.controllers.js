angular.module('posts')
    .controller('createPostController', ['$scope', '$http', '$window', '$rootScope', 'postsFactory', 'Upload',
        function($scope, $http, $window, $rootScope, postsFactory, Upload) {

            $scope.post = {
                user: $rootScope.user.id,
                image: null
            };

            $scope.removeImage = function() {
                $scope.post.image = null;
            };

            $scope.create = function() {
                if($scope.post.image == null) {
                    $http({
                        url: postsFactory.api.posts,
                        method: 'POST',
                        data: $scope.post,
                        headers: {
                            'x-access-token': $window.localStorage.getItem('token')
                        }
                    }).then(function successCallback(response) {
                        $scope.post = {};
                        console.log(response);
                    }, function errorCallback(response) {
                        console.log(response);
                    });
                } else {
                    $scope.upload($scope.post);
                }
            };

            $scope.upload = function(post) {
                Upload.upload({
                    url: 'api/v1/posts',
                    data: {
                        description: post.description,
                        image: post.image,
                        user: post.user
                    },
                    headers: {
                        'x-access-token': $window.localStorage.getItem('token')
                    }
                }).then(function successCallback(response) {
                    $scope.post = {};
                    console.log(response);
                }, function errorCallback(response) {
                    console.log(response);
                });
            };

        }]);
