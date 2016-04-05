angular.module('posts')

    .controller('commentsPostsController',
        function($scope, COMMENT_SERVICE) {
            $scope.comments = [];
            $scope.data = {};
            $scope.limitTo = 3;
            $scope.noMoreComments = true;

            $scope.showMoreComments = function() {
                $scope.limitTo = $scope.limitTo + 3;
                if($scope.limitTo >= $scope.comments.length) {
                    $scope.noMoreComments = true;
                }
            };

            $scope.getComments = function(id) {
                COMMENT_SERVICE.getComments(id).then(function(response) {
                    $scope.comments = response;
                    if($scope.comments.length > 3 && $scope.limitTo <= $scope.comments.length) {
                        $scope.noMoreComments = false;
                    } else {
                        $scope.noMoreComments = true;
                    }
                });
            };

            $scope.createComment = function(id, data) {
                COMMENT_SERVICE.createComment(id, data).then(function() {
                    $scope.getComments(id);
                    $scope.data.message = '';
                });
            };

            $scope.deleteComment = function(id, postId) {
                COMMENT_SERVICE.deleteComment(id).then(function() {
                    $scope.getComments(postId);
                });
            };

        });
