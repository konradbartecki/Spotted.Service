angular.module(ApplicationConfiguration.applicationModuleName)

    .config(['$locationProvider', '$httpProvider', 'jwtInterceptorProvider',
        function ($locationProvider, $httpProvider, jwtInterceptorProvider) {
            $locationProvider.html5Mode(true).hashPrefix('!');

            jwtInterceptorProvider.tokenGetter = function() {
                return localStorage.getItem('token');
            };

            $httpProvider.interceptors.push('jwtInterceptor');

        }
    ]);
