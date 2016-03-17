angular.module('users')
    .config(['$stateProvider', function($stateProvider){

        $stateProvider
            .state('authentication', {
                abstract: true,
                templateUrl: 'app/modules/users/client/views/authentication/authentication.client.view.html',
                access: {
                    guest: true,
                    user: false
                }
            })
            .state('authentication.signin', {
                url: '/signin',
                templateUrl: 'app/modules/users/client/views/authentication/signin/signin.client.view.html',
                access: {
                    guest: true,
                    user: false
                }
            })
            .state('authentication.signup', {
                url: '/signup',
                templateUrl: 'app/modules/users/client/views/authentication/signup/signup.client.view.html',
                access: {
                    guest: true,
                    user: false
                }
            });

    }]);
