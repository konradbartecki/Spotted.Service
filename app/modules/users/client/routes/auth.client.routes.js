angular.module('users')
    .config(['$stateProvider', function($stateProvider) {

        $stateProvider
            .state('auth', {
                abstract: true,
                templateUrl: 'app/modules/users/client/views/auth/auth.client.view.html',
                controller: 'authController',
                access: {
                    guest: true,
                    user: false
                }
            })
            .state('auth.signin', {
                url: '/signin',
                templateUrl: 'app/modules/users/client/views/auth/signin/signin.client.view.html',
                controller: 'authSignInController',
                access: {
                    guest: true,
                    user: false
                }
            })
            .state('auth.signup', {
                url: '/signup',
                templateUrl: 'app/modules/users/client/views/auth/signup/signup.client.view.html',
                controller: 'authSignUpController',
                access: {
                    guest: true,
                    user: false
                }
            });

    }]);
