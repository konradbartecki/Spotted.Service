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
