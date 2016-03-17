'use strict';

var ApplicationConfiguration = (function () {
    var applicationModuleName = 'spotted';
    var applicationModuleVendorDependencies = [
        'ui.router',
        'angular-jwt'
    ];

    var registerModule = function (moduleName, dependencies) {
        angular.module(moduleName, dependencies || []);
        angular.module(applicationModuleName).requires.push(moduleName);
    };

    return {
        applicationModuleName: applicationModuleName,
        applicationModuleVendorDependencies: applicationModuleVendorDependencies,
        registerModule: registerModule
    };
})();

angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);

angular.module(ApplicationConfiguration.applicationModuleName).config(['$locationProvider',
    function ($locationProvider) {
        $locationProvider.html5Mode(true).hashPrefix('!');
    }
]);

angular.element(document).ready(function () {
    //Fixing facebook bug with redirect
    if (window.location.hash === '#_=_') {
        window.location.hash = '#!';
    }

    //Then init the app
    angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
});

angular.module(ApplicationConfiguration.applicationModuleName)

    .config(function ($httpProvider, jwtInterceptorProvider) {

        jwtInterceptorProvider.tokenGetter = function() {
            return localStorage.getItem('token');
        };

        $httpProvider.interceptors.push('jwtInterceptor');

    })

    .run(function($state, $rootScope, $window) {

        $rootScope.$on('$stateChangeStart', function(e, to) {
            if(to.access && to.access.guest) {
                if($window.localStorage.getItem('token')) {
                    e.preventDefault();
                    $state.go('home');
                }
            } else if (to.access && to.access.user) {
                if(!$window.localStorage.getItem('token')) {
                    e.preventDefault();
                    $state.go('login');
                }
            }
        });

    })

    .factory('userService', function(jwtHelper) {

        var token = localStorage.getItem('token');

        if(token) {
            var decodedToken = token && jwtHelper.decodeToken(token);

            return {
                user: decodedToken.user
            }
        } else {

            return {
                user: ''
            }

        }

    });

ApplicationConfiguration.registerModule('core');

ApplicationConfiguration.registerModule('users');


angular.module('users')

    .factory('usersFactory', function() {

        return {
            api: {
                login: 'api/v1/auth/signin',
                register: 'api/v1/auth/signup'
            }
        }

    });

angular.module('core')
    .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

        $urlRouterProvider.otherwise('404');

        $stateProvider
            .state('home', {
                url: '/',
                templateUrl: 'app/modules/core/client/views/home/home.client.view.html'
            })
            .state('404', {
                url: '/404',
                templateUrl: 'app/modules/core/client/views/error/404.client.view.html'
            })

    }]);

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

angular.module('core')
    .controller('headerController', ['$scope', 'userService', '$window', '$state', function($scope, userService, $window, $state) {

        $scope.user = userService.user;

        $scope.logout = function () {
            $window.localStorage.removeItem('token');
            $scope.user = false;
        }

    }]);

angular.module('users')

    .controller('signinController', ['$scope', '$http', 'usersFactory', '$window', '$state',
        function($scope, $http, usersFactory, $window, $state) {
            $scope.signin = function() {
                $http({
                    url: usersFactory.api.login,
                    method: 'POST',
                    data: $scope.user
                }).then(function(response) {
                    var status = response.data.status;
                    if(status === 200) {
                        $window.localStorage.setItem('token', response.data.token);
                        $scope.user = response.user;
                        $state.go('home');
                    } else if(status === 401) {
                        $scope.error = 'Adres e-mail lub hasło są nieprawidłowe!';
                    }
                })
            };
        }])

    .controller('signupController', ['$scope', '$http', 'usersFactory', '$state',
        function($scope, $http, usersFactory, $state) {
            $scope.signup = function() {
                $http({
                    url: usersFactory.api.register,
                    method: 'POST',
                    data: $scope.user
                }).then(function(response) {
                    console.log($scope.user);
                    var status = response.data.status;
                    if(status === 200) {
                        $state.go('authentication.signin');
                    } else if(status === 409) {
                        $scope.error = 'Do podanego adresu e-mail jest już przypisane konto użytkownika w naszym serwisie!';
                    }
                })
            };
        }]);
