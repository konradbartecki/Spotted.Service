angular.module('posts')
    .controller('postsController',
        function($scope, POST_SERVICE) {

        })

    .controller('postsListController',
        function($scope, POST_SERVICE) {

            $scope.getPosts = function() {
                POST_SERVICE.getPosts().then(function(response) {
                    $scope.posts = response;
                });
            };

            $scope.deactivatePost = function(postId) {
                POST_SERVICE.deactivatePost(postId).then(function() {
                    $scope.getPosts();
                });
            };

        })

    .controller('postsCreateController',
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

            $scope.getGroupsByName = function(groupName) {
                return POST_SERVICE.getGroupsByName(groupName).then(function(response) {
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

        })

    .controller('postsViewController',
        function($scope, $stateParams, POST_SERVICE) {

            var postId = $stateParams.postId;

            POST_SERVICE.getSinglePost(postId).then(function(response) {
                $scope.post = response;
                console.log(response);
            });

        });




