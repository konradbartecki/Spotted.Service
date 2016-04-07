angular.module('users')
    .config(['$stateProvider', function($stateProvider) {

        $stateProvider
            .state('user', {
                abstract: true,
                templateUrl: 'app/modules/users/client/views/users/users.client.view.html',
                controller: 'usersController'
            })
            .state('user.posts', {
                url: '/user/posts',
                templateUrl: 'app/modules/users/client/views/users/posts/posts.client.view.html',
                controller: 'usersPostsController',
                access: {
                    guest: false,
                    user: true
                }
            })
            .state('user.settings', {
                url: '/user/settings',
                templateUrl: 'app/modules/users/client/views/users/settings/settings.client.view.html',
                controller: 'usersSettingsController',
                access: {
                    guest: false,
                    user: true
                }
            });

    }]);
