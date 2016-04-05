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
