angular.module('users')
    .config(['$stateProvider', function($stateProvider) {

        $stateProvider
            .state('groups', {
                url: '/groups',
                templateUrl: 'app/modules/groups/client/views/groups.client.view.html',
                controller: 'groupsController'
            });
        
    }]);
