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
