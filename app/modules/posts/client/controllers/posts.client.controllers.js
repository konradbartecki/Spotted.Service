angular.module('posts')

    .controller('postsController', ['$scope', '$http', '$rootScope', '$window', 'postsFactory',
        function($scope, $http, $rootScope, $window, postsFactory) {

            $scope.user = $rootScope.user;
            $scope.token = $window.localStorage.getItem('token');
            $scope.api = postsFactory.api;

        }])

    .controller('postsCreateController', ['$scope', '$http', 'Upload', '$state',
        function($scope, $http, Upload, $state) {

            $scope.post = {
                user: $scope.user.id,
                image: null
            };

            $scope.getGroups = function() {
                $http({
                    url: $scope.api.groups,
                    method: 'GET',
                    headers: {
                        'x-access-token': $scope.token
                    }
                }).then(function successCallback(response) {
                    $scope.groups = response.data;
                });
            };

            $scope.createPost = function() {
                if($scope.post.image == null) {
                    $http({
                        url: $scope.api.posts,
                        method: 'POST',
                        data: $scope.post,
                        headers: {
                            'x-access-token': $scope.token
                        }
                    }).then(function successCallback() {
                        $state.reload();
                    });
                } else {
                    $scope.createPostUpload($scope.post);
                }
            };

            $scope.createPostUpload = function(post) {
                Upload.upload({
                    url: $scope.api.posts,
                    data: {
                        description: post.description,
                        image: post.image,
                        group: post.group,
                        user: post.user
                    },
                    headers: {
                        'x-access-token': $scope.token
                    }
                }).then(function successCallback() {
                    $state.reload();
                });
            };

        }])

    .controller('postsListController', ['$scope', '$http',
        function($scope, $http) {

            $scope.commentsIsCollapsed = true;

            $scope.getPosts = function() {
                $http({
                    url: $scope.api.posts,
                    method: 'GET',
                    headers: {
                        'x-access-token': $scope.token
                    }
                }).then(function successCallback(response){
                    $scope.posts = response.data;

                    response.data.forEach(function(data, key) {
                        $scope.posts[key].number = key;
                    });
                });
            };

            $scope.getPostAuthor = function(id, number) {
                $http({
                    url: $scope.api.posts + '/' + id + '/author',
                    method: 'GET',
                    headers: {
                        'x-access-token': $scope.token
                    }
                }).then(function successCallback(response) {
                    $scope.posts[number].authorDetails = response.data;
                });
            };

            $scope.getPostGroup = function(id, number) {
                $http({
                    url: $scope.api.posts + '/' + id + '/group',
                    method: 'GET',
                    headers: {
                        'x-access-token': $scope.token
                    }
                }).then(function successCallback(response) {
                    $scope.posts[number].groupDetails = response.data;
                });
            };

        }]);
