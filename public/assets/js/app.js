'use strict';

var ApplicationConfiguration = (function () {
    var applicationModuleName = 'spotted';
    var applicationModuleVendorDependencies = [
        'ui.router',
        'angular-jwt',
        'ngFileUpload',
        'ui.bootstrap',
        'angular-loading-bar'
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

angular.module(ApplicationConfiguration.applicationModuleName)
    .config(['$locationProvider',
        function ($locationProvider) {
            $locationProvider.html5Mode(true).hashPrefix('!');
        }
    ])
    .config(['cfpLoadingBarProvider', function(cfpLoadingBarProvider) {
        cfpLoadingBarProvider.spinnerTemplate = '<div><span class="fa fa-spinner">Loading...</div>';
    }]);

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

    .run(function($state, $rootScope, $window, jwtHelper, $uibModal) {

        $rootScope.$on('$stateChangeStart', function(e, to) {
            if(to.access && to.access.guest) {
                if($window.localStorage.getItem('token')) {
                    e.preventDefault();
                    $state.go('posts');
                }
            } else if (to.access && to.access.user) {
                if(!$window.localStorage.getItem('token')) {
                    e.preventDefault();
                    $state.go('home');
                    $uibModal.open({
                        animation: false,
                        templateUrl: 'app/modules/users/client/views/authentication/signin/signin.client.view.html',
                        controller: 'authController',
                        size: 'lg'
                    });
                }
            }
        });

        $rootScope.user = false;

        $rootScope.$on('$stateChangeStart', function() {

            var token = $window.localStorage.getItem('token');

            if(token) {
                var decodedToken = token && jwtHelper.decodeToken(token);

                $rootScope.user = decodedToken.user;
            }

        });

    });

ApplicationConfiguration.registerModule('core');

ApplicationConfiguration.registerModule('posts');

ApplicationConfiguration.registerModule('users');

angular.module('posts')
    .factory('postsFactory', function() {

        return {
            api: {
                posts: 'api/v1/posts'
            }
        }

    });

angular.module('users')

    .factory('usersFactory', function() {

        return {
            api: {
                login: 'api/v1/auth/signin',
                register: 'api/v1/auth/signup'
            },
            messages: {
                error: {
                    unknown: 'Coś poszło nie tak. Spróbuj ponownie!',
                    conflict: 'Wprowadzone dane są niepoprawne. Spróbuj ponownie.',
                    emailExists: 'Podany adres e-mail jest już zajęty!'
                }
            }
        }

    });

angular.module('core')
    .config(['$stateProvider', function($stateProvider) {

        $stateProvider
            .state('home', {
                url: '/',
                templateUrl: 'app/modules/core/client/views/home/home.client.view.html',
                access: {
                    guest: true,
                    user: false
                }
            });

    }]);

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

angular.module('core')

    .controller('coreController', ['$scope', '$state', function($scope, $state) {

        $scope.state = $state;

        $scope.$watch('state.current.name', function(newValue) {
            $scope.currentState = newValue;
            if($scope.currentState == 'home') {
                $scope.isHome = true;
            } else {
                $scope.isHome = false;
            }
        });

    }])

    .controller('headerController', ['$scope', '$state', '$window', '$rootScope', '$uibModal',
        function($scope, $state, $window, $rootScope, $uibModal) {

            $scope.signout = function() {
                $window.localStorage.removeItem('token');
                $rootScope.user = false;
                $state.go('home');
            };

            $scope.openModalAuth = function(tpl) {
                var modalAuth = $uibModal.open({
                    animation: false,
                    templateUrl: 'app/modules/users/client/views/authentication/' + tpl + '/' + tpl + '.client.view.html',
                    controller: 'authController',
                    size: 'lg'
                });
            };

        }]);

angular.module('posts')
    .controller('createPostController', ['$scope', '$http', '$window', '$rootScope', 'postsFactory', 'Upload',
        function($scope, $http, $window, $rootScope, postsFactory, Upload) {

            $scope.post = {
                user: $rootScope.user.id,
                image: null
            };

            $scope.removeImage = function() {
                $scope.post.image = null;
            };

            $scope.create = function() {
                if($scope.post.image == null) {
                    $http({
                        url: postsFactory.api.posts,
                        method: 'POST',
                        data: $scope.post,
                        headers: {
                            'x-access-token': $window.localStorage.getItem('token')
                        }
                    }).then(function successCallback(response) {
                        $scope.post = {};
                        console.log(response);
                    }, function errorCallback(response) {
                        console.log(response);
                    });
                } else {
                    $scope.upload($scope.post);
                }
            };

            $scope.upload = function(post) {
                Upload.upload({
                    url: 'api/v1/posts',
                    data: {
                        description: post.description,
                        image: post.image,
                        user: post.user
                    },
                    headers: {
                        'x-access-token': $window.localStorage.getItem('token')
                    }
                }).then(function successCallback(response) {
                    console.log(response);
                }, function errorCallback(response) {
                    console.log(response);
                });
            };

        }]);

angular.module('users')

    .controller('authController', ['$scope', '$uibModalInstance', '$uibModal', function($scope, $uibModalInstance, $uibModal) {

        $scope.closeModal = function() {
            $uibModalInstance.dismiss('cancel');
        };

        $scope.switchModal = function(tpl) {
            $scope.closeModal();
            $uibModal.open({
                animation: false,
                templateUrl: 'app/modules/users/client/views/authentication/' + tpl + '/' + tpl + '.client.view.html',
                controller: 'authController',
                size: 'lg'
            });
        };

    }])

    .controller('signinController', ['$scope', '$http', 'usersFactory', '$window', '$state',
        function($scope, $http, usersFactory, $window, $state) {
            $scope.message = {};

            $scope.signin = function() {
                $http({
                    url: usersFactory.api.login,
                    method: 'POST',
                    data: $scope.user
                }).then(function successCallback(response) {
                    $window.localStorage.setItem('token', response.data.token);
                    $scope.closeModal();
                    $state.go('posts');
                }, function errorCallback(response) {
                    var status = response.status;
                    if(status == 400) {
                        $scope.message.error = usersFactory.messages.error.unknown;
                    } else if(status == 401) {
                        $scope.message.error = usersFactory.messages.error.conflict;
                    }
                });
            };
        }])

    .controller('signupController', ['$scope', '$http', 'usersFactory', '$uibModal',
        function($scope, $http, usersFactory, $uibModal) {
            $scope.message = {};

            $scope.signup = function() {
                $http({
                    url: usersFactory.api.register,
                    method: 'POST',
                    data: $scope.user
                }).then(function successCallback() {
                    $scope.closeModal();
                    $uibModal.open({
                        animation: false,
                        templateUrl: 'app/modules/users/client/views/authentication/signin/signin.client.view.html',
                        controller: 'authController',
                        size: 'lg'
                    });
                }, function errorCallback(response) {
                    var status = response.status;
                    if(status == 400 || status == 500) {
                        $scope.message.error = usersFactory.messages.error.unknown;
                    } else if(status == 409) {
                        $scope.message.error = usersFactory.messages.error.emailExists;
                    }
                });
            };
        }]);
