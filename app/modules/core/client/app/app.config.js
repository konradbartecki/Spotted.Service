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
