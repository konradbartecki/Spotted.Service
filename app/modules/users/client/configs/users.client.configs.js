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
