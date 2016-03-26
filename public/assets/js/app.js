'use strict';

var ApplicationConfiguration = (function () {
    var applicationModuleName = 'spotted';
    var applicationModuleVendorDependencies = [
        'ui.router',
        'angular-jwt',
        'ngFileUpload',
        'ui.bootstrap',
        'angular-bootstrap-select',
        'angularMoment'
    ];

    var registerModule = function (moduleName, dependencies) {
        angular.module(moduleName, dependencies || []);
        angular.module(applicationModuleName).requires.push(moduleName);

        angular.module(moduleName).config(['$httpProvider', function($httpProvider) {
            if (!$httpProvider.defaults.headers.get) {
                $httpProvider.defaults.headers.get = {};
            }
            //disable IE ajax request caching
            $httpProvider.defaults.headers.get['If-Modified-Since'] = 'Mon, 26 Jul 1997 05:00:00 GMT';
            $httpProvider.defaults.headers.get['Cache-Control'] = 'no-cache';
            $httpProvider.defaults.headers.get['Pragma'] = 'no-cache';
        }]);

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

    .run(function(amMoment) {
        amMoment.changeLocale('pl');
    })

    .constant('angularMomentConfig', {
        timezone: 'Europe/Warsaw'
    });


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

ApplicationConfiguration.registerModule('comments');

ApplicationConfiguration.registerModule('core');

ApplicationConfiguration.registerModule('posts');

ApplicationConfiguration.registerModule('users');

angular.module('comments')
    .factory('commentsFactory', function() {

        return {
            api: {
                comments: 'api/v1/comments'
            }
        }

    });

angular.module('posts')
    .factory('postsFactory', function() {

        return {
            api: {
                posts: 'api/v1/posts',
                postGroup: 'api/v1/posts/groups',
                groups: 'api/v1/groups'
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

angular.module('comments')
    .controller('commentsController', ['$scope', '$rootScope', 'commentsFactory', function($scope, $rootScope, commentsFactory) {

        $scope.user = $rootScope.user.id;
        $scope.api = commentsFactory.api;

        console.log($scope.user);

    }])

    .controller('commentsCreateController', ['$scope', '$http', function($scope, $http) {

        $scope.comment = {};

        $scope.createComment = function(id) {

            $http({
                url: $scope.api.comments,
                method: 'POST',
                data: {
                    message: $scope.comment.message,
                    user: $scope.user,
                    post: id
                },
                headers: {
                    'x-access-token': $scope.token
                }
            }).then(function successCallback() {
                $scope.comment = {};
            });

        };

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

angular.module('posts')

    .controller('postsController', ['$scope', '$http', '$rootScope', '$window', 'postsFactory',
        function($scope, $http, $rootScope, $window, postsFactory) {

            $scope.user = $rootScope.user;
            $scope.token = $window.localStorage.getItem('token');
            $scope.api = postsFactory.api;

        }])

    .controller('postsCreateController', ['$scope', '$http', 'Upload', '$state',
        function($scope, $http, Upload, $state) {

            $scope.post = {
                user: $scope.user.id,
                image: null
            };

            $scope.getGroups = function() {
                $http({
                    url: $scope.api.groups,
                    method: 'GET',
                    headers: {
                        'x-access-token': $scope.token
                    }
                }).then(function successCallback(response) {
                    $scope.groups = response.data;
                });
            };

            $scope.createPost = function() {
                if($scope.post.image == null) {
                    $http({
                        url: $scope.api.posts,
                        method: 'POST',
                        data: $scope.post,
                        headers: {
                            'x-access-token': $scope.token
                        }
                    }).then(function successCallback() {
                        $state.reload();
                    });
                } else {
                    $scope.createPostUpload($scope.post);
                }
            };

            $scope.createPostUpload = function(post) {
                Upload.upload({
                    url: $scope.api.posts,
                    data: {
                        description: post.description,
                        image: post.image,
                        group: post.group,
                        user: post.user
                    },
                    headers: {
                        'x-access-token': $scope.token
                    }
                }).then(function successCallback() {
                    $state.reload();
                });
            };

        }])

    .controller('postsListController', ['$scope', '$http',
        function($scope, $http) {

            $scope.commentsIsCollapsed = true;

            $scope.getPosts = function() {
                $http({
                    url: $scope.api.posts,
                    method: 'GET',
                    headers: {
                        'x-access-token': $scope.token
                    }
                }).then(function successCallback(response){
                    $scope.posts = response.data;

                    response.data.forEach(function(data, key) {
                        $scope.posts[key].number = key;
                    });
                });
            };

            $scope.getPostAuthor = function(id, number) {
                $http({
                    url: $scope.api.posts + '/' + id + '/author',
                    method: 'GET',
                    headers: {
                        'x-access-token': $scope.token
                    }
                }).then(function successCallback(response) {
                    $scope.posts[number].authorDetails = response.data;
                });
            };

            $scope.getPostGroup = function(id, number) {
                $http({
                    url: $scope.api.posts + '/' + id + '/group',
                    method: 'GET',
                    headers: {
                        'x-access-token': $scope.token
                    }
                }).then(function successCallback(response) {
                    $scope.posts[number].groupDetails = response.data;
                });
            };

        }]);
