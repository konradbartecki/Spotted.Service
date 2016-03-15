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
