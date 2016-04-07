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

            $scope.getComments = function(postId) {
                COMMENT_SERVICE.getComments(postId).then(function(response) {
                    $scope.comments = response;
                    if($scope.comments.length > 3 && $scope.limitTo <= $scope.comments.length) {
                        $scope.noMoreComments = false;
                    } else {
                        $scope.noMoreComments = true;
                    }
                });
            };

            $scope.createComment = function(postId, data) {
                COMMENT_SERVICE.createComment(postId, data).then(function() {
                    $scope.getComments(postId);
                    $scope.data.message = '';
                });
            };

            $scope.deleteComment = function(commentId, postId) {
                COMMENT_SERVICE.deleteComment(commentId).then(function() {
                    $scope.getComments(postId);
                });
            };

        });
