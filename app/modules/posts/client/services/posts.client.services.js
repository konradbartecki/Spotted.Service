angular.module('posts')
    .factory('postsFactory', function() {

        return {
            api: {
                posts: 'api/v1/posts'
            }
        }

    });
