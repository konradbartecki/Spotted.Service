angular.module(ApplicationConfiguration.applicationModuleName)
    .factory('ALERT_SERVICE', function($rootScope) {
        return {
            push: function(type, message) {
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
                    default:
                        $rootScope.alerts = {
                            warning: message
                        };
                }
            }
        }
    });
