'use strict';

var ApplicationConfiguration = (function () {
    var applicationModuleName = 'spotted';
    var applicationModuleVendorDependencies = [
        'ui.router',
        'angular-loading-bar',
        'ngAnimate',
        'angular-jwt',
        'ngFileUpload',
        'ui.bootstrap',
        'angular-bootstrap-select',
        'angularMoment',
        'ngTagsInput'
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

angular.element(document).ready(function () {
    //Fixing facebook bug with redirect
    if (window.location.hash === '#_=_') {
        window.location.hash = '#!';
    }

    //Then init the app
    angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
});


angular.module(ApplicationConfiguration.applicationModuleName)

    .config(['$locationProvider', '$httpProvider', 'jwtInterceptorProvider', 'cfpLoadingBarProvider',
        function ($locationProvider, $httpProvider, jwtInterceptorProvider, cfpLoadingBarProvider) {
            $locationProvider.html5Mode(true).hashPrefix('!');

            jwtInterceptorProvider.tokenGetter = function() {
                return localStorage.getItem('token');
            };

            $httpProvider.interceptors.push('jwtInterceptor');

            cfpLoadingBarProvider.includeSpinner = false;
        }
    ]);

angular.module(ApplicationConfiguration.applicationModuleName)
    .run(function($window, $state, $rootScope, $timeout, amMoment, jwtHelper) {

        // MOMENT LOCALE
        amMoment.changeLocale('pl');

        // STATE
        $rootScope.$state = $state;

        // ACCESS FUNCTION
        $rootScope.$on('$stateChangeStart', function(e, to) {
            if(to.access && to.access.guest) {
                if($window.localStorage.getItem('token')) {
                    e.preventDefault();
                    $state.go('home');
                }
            } else if (to.access && to.access.user) {
                if(!$window.localStorage.getItem('token')) {
                    e.preventDefault();
                    $state.go('auth.signin');
                }
            }
        });

        // CURRENT USER
        $rootScope.user = false;
        $rootScope.$on('$stateChangeStart', function() {
            var token = $window.localStorage.getItem('token');
            if(token) {
                var decodedToken = token && jwtHelper.decodeToken(token);
                $rootScope.token = token;
                $rootScope.user = decodedToken.user;
            }
        });

        // ALERTS FUNCTION
        $rootScope.alerts = false;
        $rootScope.$watch('alerts', function(newValue) {
            if(newValue) {
                $timeout(function() {
                    $rootScope.alerts = false;
                }, 3000);
            }
        });


    });

var ApiURL = 'api/v1';

angular.module(ApplicationConfiguration.applicationModuleName)
    .constant('API', {
        auth: {
            signIn: ApiURL + '/auth/signin',
            signUp: ApiURL + '/auth/signup'
        },
        users: ApiURL + '/users',
        groups: ApiURL + '/groups',
        posts: ApiURL + '/posts'
    });

ApplicationConfiguration.registerModule('core');

ApplicationConfiguration.registerModule('groups');

ApplicationConfiguration.registerModule('users');

ApplicationConfiguration.registerModule('posts');

angular.module(ApplicationConfiguration.applicationModuleName)
    .directive("ngCompare", function() {
        return {
            require: "ngModel",
            scope: {
                otherModelValue: "=ngCompare"
            },
            link: function(scope, element, attributes, ngModel) {

                ngModel.$validators.ngCompare = function(modelValue) {
                    return modelValue == scope.otherModelValue;
                };

                scope.$watch("otherModelValue", function() {
                    ngModel.$validate();
                });
            }
        };
    })

    .directive('ngClickAnyWhere', function($document){
        return {
            restrict: 'A',
            link: function(scope, elem, attr, ctrl) {
                elem.bind('click', function(e) {
                    e.stopPropagation();
                });
                $document.bind('click', function() {
                    scope.$apply(attr.ngClickAnyWhere);
                })
            }
        }
    });

angular.module(ApplicationConfiguration.applicationModuleName)
    .factory('ALERT_SERVICE', function($rootScope) {

        var alertService = {};

        alertService.push = function(type, message) {
            switch(type) {
                case 'success':
                    $rootScope.alerts = {
                        success: message
                    };
                    break;
                case 'error':
                    $rootScope.alerts = {
                        error: message
                    };
                    break;
            }
        };

        return alertService;

    });

angular.module('posts')

    .factory('COMMENT_SERVICE', function($http, API, $rootScope, COMMENT_EVENTS) {
        return {

            getComments: function(id) {
                return $http.get(API.posts + '/' + id + '/comments').then(function(response) {
                    return response.data;
                });
            },

            createComment: function(id, data) {
                return $http({
                    url: API.posts + '/' + id + '/comments',
                    method: 'POST',
                    data: {
                        message: data.message,
                        author: $rootScope.user.id
                    },
                    headers: {
                        'x-access-token': $rootScope.token
                    }
                }).then(function successCallback() {
                    COMMENT_EVENTS.createCommentSuccess();
                }, function errorCallback() {
                    COMMENT_EVENTS.createCommentFailed();
                });
            },

            deleteComment: function(id) {
                return $http({
                    url: API.posts + '/comments/' + id,
                    method: 'DELETE',
                    headers: {
                        'x-access-token': $rootScope.token
                    }
                }).then(function successCallback() {
                    COMMENT_EVENTS.deleteCommentSuccess();
                }, function errorCallback() {
                    COMMENT_EVENTS.deleteCommentFailed();
                });
            }

        }
    })

    .factory('COMMENT_EVENTS', function(ALERT_SERVICE) {
        return {

            createCommentSuccess: function() {
                ALERT_SERVICE.push('success', 'Twój komentarz został pomyślnie dodany!');
            },

            createCommentFailed: function() {
                ALERT_SERVICE.push('error', 'Coś poszło nie tak. Spróbuj ponownie!');
            },

            deleteCommentSuccess: function() {
                ALERT_SERVICE.push('success', 'Twój komentarz został pomyślnie usunięty!');
            },

            deleteCommentFailed: function() {
                ALERT_SERVICE.push('error', 'Coś poszło nie tak. Spróbuj ponownie!');
            }

        }
    });

angular.module('posts')

    .factory('POST_SERVICE', function($http, API, $rootScope, Upload, POST_EVENTS) {
        return {
            getPosts: function() {
                return $http.get(API.posts).then(function(response) {
                    return response.data;
                });
            },
            getGroupsByName: function(query) {
                return $http.get(API.groups + '/' + query).then(function(response) {
                    return response.data;
                });
            },
            createPost: function(data) {
                return $http({
                    url: API.posts,
                    method: 'POST',
                    data: {
                        message: data.message,
                        group: data.group[0]._id,
                        author: $rootScope.user.id
                    },
                    headers: {
                        'x-access-token': $rootScope.token
                    }
                }).then(function successCallback() {
                    POST_EVENTS.createPostSuccess();
                }, function errorCallback(response) {
                    POST_EVENTS.createPostFailed();
                    console.log(response);
                });
            },
            createPostUpload: function(data) {
                return Upload.upload({
                    url: API.posts,
                    data: {
                        message: data.message,
                        image: data.picture,
                        group: data.group[0]._id,
                        author: $rootScope.user.id
                    },
                    headers: {
                        'x-access-token': $rootScope.token
                    }
                }).then(function successCallback() {
                    POST_EVENTS.createPostSuccess();
                }, function errorCallback() {
                    POST_EVENTS.createPostFailed();
                });
            }
        }
    })

    .factory('POST_EVENTS', function(ALERT_SERVICE) {
        return {

            createPostSuccess: function() {
                ALERT_SERVICE.push('success', 'Ogłoszenie zostało pomyślnie dodane.');
            },
            createPostFailed: function() {
                ALERT_SERVICE.push('error', 'Coś poszło nie tak. Spróbuj ponownie!');
            }

        }
    });

angular.module('groups')
    .factory('GROUP_SERVICE', function($http, API, $rootScope, GROUP_EVENTS) {
        return {
            getGroups: function() {
                return $http.get(API.groups).then(function(response) {
                    return response.data;
                });
            },
            joinToGroup: function(id) {
                return $http({
                    url: API.users + '/' + $rootScope.user.id + '/group',
                    method: 'POST',
                    data: { group: {id: id} },
                    headers: {
                        'x-access-token': $rootScope.token
                    }
                }).then(function successCallback() {
                    GROUP_EVENTS.joinToGroupSuccess();
                }, function errorCallback() {
                    GROUP_EVENTS.joinToGroupFailed();
                });
            }
        }
    })

    .factory('GROUP_EVENTS', function(ALERT_SERVICE) {
        return {

            joinToGroupSuccess: function() {
                ALERT_SERVICE.push('success', 'Groupa została pomyślnie dodana!');
            },

            joinToGroupFailed: function() {
                ALERT_SERVICE.push('error', 'Coś poszło nie tak. Spróbuj ponownie!');
            }

        }
    });

angular.module('users')

    .factory('AUTH_SERVICE', function($http, $state, $window, API, AUTH_EVENTS) {
        return {

            signIn: function(credentials) {
                return $http
                    .post(API.auth.signIn, credentials)
                    .then(function successCallback(response) {
                        var token = response.data.token;
                        $window.localStorage.setItem('token', token);
                        AUTH_EVENTS.signInSuccess();
                        $state.go('home');
                    }, function errorCallback(response) {
                        AUTH_EVENTS.signInFailed(response.data.status);
                    });
            },

            signUp: function(credentials) {
                return $http
                    .post(API.auth.signUp, credentials)
                    .then(function successCallback(){
                        AUTH_EVENTS.signUpSuccess();
                        $state.go('auth.signin');
                    }, function errorCallback(response) {
                        AUTH_EVENTS.signUpFailed(response.data.status);
                    });
            }

        }
    })

    .factory('AUTH_EVENTS', function(ALERT_SERVICE) {
        return {

            signInSuccess: function() {
                ALERT_SERVICE.push('success', 'Pomyślnie zalogowano. Witamy na spotted!');
            },

            signInFailed: function(status) {
                switch (status) {
                    case 1401:
                        ALERT_SERVICE.push('error', 'Wprowadzone dane są niepoprawne. Spróbuj ponownie!');
                        break;
                    default:
                        ALERT_SERVICE.push('error', 'Coś poszło nie tak. Spróbuj ponownie!');
                }
            },

            signUpSuccess: function() {
                ALERT_SERVICE.push('success', 'Konto zostało utworzone. Możesz teraz się zalogować!');
            },

            signUpFailed: function(status) {
                switch (status) {
                    case 1402:
                        ALERT_SERVICE.push('error', 'Podany e-mail jest już przypisany do konta spotted!');
                        break;
                    default:
                        ALERT_SERVICE.push('error', 'Coś poszło nie tak. Spróbuj ponownie!');
                }
            }

        }
    });

angular.module('users')

    .factory('USER_SERVICE', function($http, $window, API, $rootScope, $state, USER_EVENTS, Upload) {
        return {

            getCurrentUser: function() {
                return $http({
                    url: API.users + '/' + $rootScope.user.id,
                    method: 'GET',
                    headers: {
                        'x-access-token': $rootScope.token
                    }
                }).then(function(response) {
                    return response.data;
                });
            },

            getUserPosts: function(id) {
                return $http({
                    url: API.posts + '/user/' + id,
                    method: 'GET',
                    headers: {
                        'x-access-token': $rootScope.token
                    }
                }).then(function(response) {
                    return response.data;
                });
            },

            getUserGroups: function() {
                return $http({
                    url: API.users + '/' + $rootScope.user.id + '/group',
                    method: 'GET',
                    headers: {
                        'x-access-token': $rootScope.token
                    }
                }).then(function(response) {
                    return response.data;
                });
            },

            changePassword: function(credentials) {
                $http({
                    url: API.users + '/' + $rootScope.user.id + '/password',
                    method: 'POST',
                    data: {
                        password: credentials.password,
                        newPassword: credentials.newPassword
                    },
                    headers: {
                        'x-access-token': $rootScope.token
                    }
                }).then(function successCallback() {
                    USER_EVENTS.changePasswordSuccess();
                    $window.localStorage.removeItem('token');
                    $rootScope.user = false;
                    $state.go('auth.signin');
                }, function errorCallback(response) {
                    USER_EVENTS.changePasswordFailed(response.data.status);
                });
            },

            changePicture: function(credentials) {
                Upload.upload({
                    url: API.users + '/' + $rootScope.user.id + '/picture',
                    data: {
                        image: credentials.picture
                    },
                    headers: {
                        'x-access-token': $rootScope.token
                    }
                }).then(function successCallback() {
                    USER_EVENTS.changePictureSuccess();
                    $state.reload();
                }, function errorCallback() {
                    USER_EVENTS.changePictureFailed();
                });
            }

        }
    })

    .factory('USER_EVENTS', function(ALERT_SERVICE) {

        return {

            changePasswordSuccess: function() {
                ALERT_SERVICE.push('success', 'Hasło zostało zmienione. Zaloguj się ponownie!');
            },

            changePasswordFailed: function(status) {
                switch (status) {
                    case 1401:
                        ALERT_SERVICE.push('error', 'Aktualne hasło jest nie poprawne. Spróbuj ponownie!');
                        break;
                    default:
                        ALERT_SERVICE.push('error', 'Coś poszło nie tak. Spróbuj ponownie!');
                }
            },

            changePictureSuccess: function() {
                ALERT_SERVICE.push('success', 'Twoje zdjęcie zostało zmienione.');
            },

            changePictureFailed: function() {
                ALERT_SERVICE.push('error', 'Coś poszło nie tak. Spróbuj ponownie!');
            }

        }

    });

angular.module('core')
    .config(['$stateProvider', function($stateProvider) {

        $stateProvider
            .state('home', {
                url: '/',
                templateUrl: 'app/modules/core/client/views/home/home.client.view.html'
            });

    }]);

angular.module('users')
    .config(['$stateProvider', function($stateProvider) {

        $stateProvider
            .state('groups', {
                url: '/groups',
                templateUrl: 'app/modules/groups/client/views/groups.client.view.html',
                controller: 'groupsController'
            });
        
    }]);

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
                controller: 'authSigninController',
                access: {
                    guest: true,
                    user: false
                }
            })
            .state('auth.signup', {
                url: '/signup',
                templateUrl: 'app/modules/users/client/views/auth/signup/signup.client.view.html',
                controller: 'authSignupController',
                access: {
                    guest: true,
                    user: false
                }
            });

    }]);

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

angular.module('posts')

    .controller('commentsPostsController',
        function($scope, COMMENT_SERVICE) {
            $scope.comments = [];
            $scope.data = {};
            $scope.limitTo = 3;
            $scope.noMoreComments = true;

            $scope.showMoreComments = function() {
                $scope.limitTo = $scope.limitTo + 3;
                if($scope.limitTo >= $scope.comments.length) {
                    $scope.noMoreComments = true;
                }
            };

            $scope.getComments = function(id) {
                COMMENT_SERVICE.getComments(id).then(function(response) {
                    $scope.comments = response;
                    if($scope.comments.length > 3 && $scope.limitTo <= $scope.comments.length) {
                        $scope.noMoreComments = false;
                    } else {
                        $scope.noMoreComments = true;
                    }
                });
            };

            $scope.createComment = function(id, data) {
                COMMENT_SERVICE.createComment(id, data).then(function() {
                    $scope.getComments(id);
                    $scope.data.message = '';
                });
            };

            $scope.deleteComment = function(id, postId) {
                COMMENT_SERVICE.deleteComment(id).then(function() {
                    $scope.getComments(postId);
                });
            };

        });

angular.module('posts')
    .controller('postsController',
        function($scope, POST_SERVICE) {
            $scope.getPosts = function() {
                POST_SERVICE.getPosts().then(function(response) {
                    $scope.posts = response;
                });
            };
        })

    .controller('createPostsController',
        function($scope, POST_SERVICE) {

            $scope.openCreatePost = function() {
                $scope.activeCreatePost = true;
            };

            $scope.closeCreatePost = function() {
                $scope.activeCreatePost = false;
            };

            $scope.data = {
                picture: null
            };

            $scope.removePicture = function() {
                $scope.data.picture = null;
            };

            $scope.getGroupsByName = function(query) {
                return POST_SERVICE.getGroupsByName(query).then(function(response) {
                    return response;
                });
            };

            $scope.createPost = function(data) {
                if(data.picture == null) {
                    POST_SERVICE.createPost(data).then(function() {
                        $scope.data = {};
                        $scope.getPosts();
                        $scope.closeCreatePost();
                    });
                } else {
                    POST_SERVICE.createPostUpload(data).then(function() {
                        $scope.data = {};
                        $scope.getPosts();
                        $scope.closeCreatePost();
                    });
                }
            };

        });



angular.module('core')

    .controller('coreController',
        function($scope, $rootScope, $state) {

        })

    .controller('headerController', ['$scope', '$state', '$window', '$rootScope',
        function($scope, $state, $window, $rootScope) {

            $scope.signout = function() {
                $window.localStorage.removeItem('token');
                $rootScope.user = false;
                $rootScope.alerts = {
                  success: 'Poprawnie wylogowano z serwisu spotted. Zapraszamy ponownie!'
                };
                $state.go('home');
            };

        }]);

angular.module('groups')
    .controller('groupsController',
        function($scope, GROUP_SERVICE) {
            GROUP_SERVICE.getGroups().then(function(response) {
                $scope.groups = response;
            });

            $scope.joinToGroup = function(id) {
                GROUP_SERVICE.joinToGroup(id).then();
            }

        });

angular.module('users')

    .controller('authController', ['$scope', function($scope) {
        $scope.credentials = {
            email: '',
            password: ''
        }
    }])

    .controller('authSigninController',
        function($scope, $state, AUTH_SERVICE) {
            $scope.signIn = function(credentials) {
                AUTH_SERVICE.signIn(credentials).then(function() {
                    $scope.credentials.password = '';
                });
            };
        })

    .controller('authSignupController',
        function($scope, $state, AUTH_SERVICE) {
            $scope.signUp = function(credentials) {
                AUTH_SERVICE.signUp(credentials)
                    .then(function successCallback() {
                        $scope.credentials = {};
                    });
            };
        });

angular.module('users')

    .controller('userController',
        function($scope, USER_SERVICE) {
            USER_SERVICE.getCurrentUser().then(function(response) {
                $scope.currentUser = response;
            });
        })

    .controller('userPostsController', function($scope, USER_SERVICE) {

        $scope.getUserPosts = function(id) {
            USER_SERVICE.getUserPosts(id).then(function(response) {
                $scope.userPosts = response;
                console.log(response);
            });
        };

    })

    .controller('userGroupsController', function($scope, USER_SERVICE) {

        USER_SERVICE.getUserGroups().then(function(response) {
            $scope.userGroups = response;
        });

    })

    .controller('userSettingsController', function($scope, USER_SERVICE) {

        $scope.changePassword = function(credentials) {
            USER_SERVICE.changePassword(credentials);
        };

        $scope.changePicture = function(credentials) {
            USER_SERVICE.changePicture(credentials);
        };

    });

