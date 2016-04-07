angular.module('core')
    .config(['$stateProvider', function($stateProvider) {

        $stateProvider
            .state('home', {
                url: '/',
                templateUrl: 'app/modules/core/client/views/home/home.client.view.html'
            });

    }]);
