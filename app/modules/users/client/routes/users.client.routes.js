angular.module('users')
    .config(['$stateProvider', function($stateProvider){

        $stateProvider
            .state('user', {
                url: '/user',
                data: {
                    requireLogin: true
                }
            })
            .state('login', {
                url: '/user/login',
                templateUrl: 'app/modules/users/client/views/login/login.client.view.html',
                data: {
                    requireQuest: true
                }
            })
            .state('register', {
                url: '/user/register',
                templateUrl: 'app/modules/users/client/views/register/register.client.view.html',
                data: {
                    requireQuest: true
                }
            });

    }]);
