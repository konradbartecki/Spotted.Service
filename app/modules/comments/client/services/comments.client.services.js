angular.module('comments')
    .factory('commentsFactory', function() {

        return {
            api: {
                comments: 'api/v1/comments'
            }
        }

    });
