angular.module('users')
    .config(['$stateProvider', function($stateProvider) {

        $stateProvider
            .state('user', {
                abstract: true,
                templateUrl: 'app/modules/users/client/views/user/user.client.view.html',
                controller: 'userController'
            })
            .state('user.posts', {
                url: '/user/posts',
                templateUrl: 'app/modules/users/client/views/user/posts/posts.client.view.html',
                controller: 'userPostsController',
                access: {
                    guest: false,
                    user: true
                }
            })
            .state('user.groups', {
                url: '/user/groups',
                templateUrl: 'app/modules/users/client/views/user/groups/groups.client.view.html',
                controller: 'userGroupsController',
                access: {
                    guest: false,
                    user: true
                }
            })
            .state('user.settings', {
                url: '/user/settings',
                templateUrl: 'app/modules/users/client/views/user/settings/settings.client.view.html',
                controller: 'userSettingsController',
                access: {
                    guest: false,
                    user: true
                }
            });

    }]);
