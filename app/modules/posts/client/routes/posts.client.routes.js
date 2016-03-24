angular.module('posts')
    .config(['$stateProvider', function($stateProvider) {

        $stateProvider
            .state('posts', {
                url: '/posts',
                templateUrl: 'app/modules/posts/client/views/posts.client.view.html',
                access: {
                    guest: false,
                    user: true
                }
            });

    }]);
