'use strict';

var ApplicationConfiguration = (function () {
    var applicationModuleName = 'spotted';
    var applicationModuleVendorDependencies = [
        'ui.router',
        'angular-jwt',
        'ngFileUpload',
        'ui.bootstrap',
        'angular-loading-bar'
    ];

    var registerModule = function (moduleName, dependencies) {
        angular.module(moduleName, dependencies || []);
        angular.module(applicationModuleName).requires.push(moduleName);
    };

    return {
        applicationModuleName: applicationModuleName,
        applicationModuleVendorDependencies: applicationModuleVendorDependencies,
        registerModule: registerModule
    };
})();

angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);

angular.module(ApplicationConfiguration.applicationModuleName)
    .config(['$locationProvider',
        function ($locationProvider) {
            $locationProvider.html5Mode(true).hashPrefix('!');
        }
    ])
    .config(['cfpLoadingBarProvider', function(cfpLoadingBarProvider) {
        cfpLoadingBarProvider.includeSpinner = false;
    }]);

angular.element(document).ready(function () {
    //Fixing facebook bug with redirect
    if (window.location.hash === '#_=_') {
        window.location.hash = '#!';
    }

    //Then init the app
    angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
});
