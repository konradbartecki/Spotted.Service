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
            if(to.data && to.data.requireQuest) {
                if($window.localStorage.getItem('token')) {
                    e.preventDefault();
                    $state.go('home');
                }
            } else if (to.data && to.data.requireLogin) {
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
                login: 'api/v1/users/login',
                register: 'api/v1/users/register'
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

angular.module('core')
    .controller('headerController', ['$scope', 'userService', function($scope, userService) {

        $scope.user = userService.user;

    }]);

angular.module('users')

    .controller('loginController', ['$scope', '$http', 'usersFactory', '$window', '$state',
        function($scope, $http, usersFactory, $window, $state) {
            $scope.login = function() {
                $http({
                    url: usersFactory.api.login,
                    method: 'POST',
                    data: $scope.user
                }).then(function(response) {
                    var status = response.data.status;
                    if(status === 200) {
                        $window.localStorage.setItem('token', response.data.token);
                        $state.go('home');
                    } else if(status === 401) {
                        console.log('Podany adres e-mail lub hasło są nieprawidłowe!');
                    }
                })
            };
        }])

    .controller('registerController', ['$scope', '$http', 'usersFactory', '$state',
        function($scope, $http, usersFactory, $state) {
            $scope.user = {
                email: '',
                password: '',
                sex: ''
            };
            $scope.register = function() {
                $http({
                    url: usersFactory.api.register,
                    method: 'POST',
                    data: $scope.user
                }).then(function(response) {
                    console.log($scope.user);
                    var status = response.data.status;
                    if(status === 200) {
                        $state.go('login');
                    } else if(status === 409) {
                        console.log('Do podanego adresu e-mail przypisane jest już konto użytkownika!!');
                    }
                })
            };
        }]);
