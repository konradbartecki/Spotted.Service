angular.module('posts')
    .factory('postsFactory', function() {

        return {
            api: {
                posts: 'api/v1/posts',
                postGroup: 'api/v1/posts/groups',
                groups: 'api/v1/groups'
            }
        }

    });
