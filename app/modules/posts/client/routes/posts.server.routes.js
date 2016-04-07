angular.module('posts')
    .config(['$stateProvider', function($stateProvider) {

        $stateProvider
            .state('posts', {
                abstract: true,
                templateUrl: 'app/modules/posts/client/views/posts/posts.client.view.html',
                controller: 'postsController'
            })
            .state('posts.list', {
                url: '/posts',
                templateUrl: 'app/modules/posts/client/views/posts/list/list.client.view.html',
                controller: 'postsListController'
            })
            .state('posts.view', {
                url: '/posts/:postId',
                templateUrl: 'app/modules/posts/client/views/posts/view/view.client.view.html',
                controller: 'postsViewController'
            });

    }]);
