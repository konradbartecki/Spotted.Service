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
