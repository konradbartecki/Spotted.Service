angular.module('posts')
    .controller('postsController',
        function($scope, POST_SERVICE) {
            $scope.getPosts = function() {
                POST_SERVICE.getPosts().then(function(response) {
                    $scope.posts = response;
                });
            };
        })

    .controller('createPostsController',
        function($scope, POST_SERVICE) {

            $scope.openCreatePost = function() {
                $scope.activeCreatePost = true;
            };

            $scope.closeCreatePost = function() {
                $scope.activeCreatePost = false;
            };

            $scope.data = {
                picture: null
            };

            $scope.removePicture = function() {
                $scope.data.picture = null;
            };

            $scope.getGroupsByName = function(query) {
                return POST_SERVICE.getGroupsByName(query).then(function(response) {
                    return response;
                });
            };

            $scope.createPost = function(data) {
                if(data.picture == null) {
                    POST_SERVICE.createPost(data).then(function() {
                        $scope.data = {};
                        $scope.getPosts();
                        $scope.closeCreatePost();
                    });
                } else {
                    POST_SERVICE.createPostUpload(data).then(function() {
                        $scope.data = {};
                        $scope.getPosts();
                        $scope.closeCreatePost();
                    });
                }
            };

        });


