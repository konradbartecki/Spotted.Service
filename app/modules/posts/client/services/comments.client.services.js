angular.module('posts')

    .factory('COMMENT_SERVICE', function($http, API, $rootScope, COMMENT_EVENTS) {
        return {

            getComments: function(postId) {
                return $http.get(API.posts + '/' + postId + '/comments').then(function(response) {
                    return response.data;
                });
            },

            createComment: function(postId, data) {
                return $http({
                    url: API.posts + '/' + postId + '/comments',
                    method: 'POST',
                    data: {
                        message: data.message,
                        author: $rootScope.user.id
                    },
                    headers: {
                        'x-access-token': $rootScope.token
                    }
                }).then(function successCallback() {
                    COMMENT_EVENTS.createCommentSuccess();
                }, function errorCallback() {
                    COMMENT_EVENTS.createCommentFailed();
                });
            },

            deleteComment: function(commentId) {
                return $http({
                    url: API.posts + '/comments/' + commentId,
                    method: 'DELETE',
                    headers: {
                        'x-access-token': $rootScope.token
                    }
                }).then(function successCallback() {
                    COMMENT_EVENTS.deleteCommentSuccess();
                }, function errorCallback() {
                    COMMENT_EVENTS.deleteCommentFailed();
                });
            }

        }
    })

    .factory('COMMENT_EVENTS', function(ALERT_SERVICE) {
        return {

            createCommentSuccess: function() {
                ALERT_SERVICE.push('success', 'Twój komentarz został pomyślnie dodany!');
            },

            createCommentFailed: function() {
                ALERT_SERVICE.push('error', 'Coś poszło nie tak. Spróbuj ponownie!');
            },

            deleteCommentSuccess: function() {
                ALERT_SERVICE.push('success', 'Twój komentarz został pomyślnie usunięty!');
            },

            deleteCommentFailed: function() {
                ALERT_SERVICE.push('error', 'Coś poszło nie tak. Spróbuj ponownie!');
            }

        }
    });
