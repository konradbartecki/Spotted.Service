angular.module('users')

    .controller('authController', ['$scope', function($scope) {
        $scope.credentials = {
            email: '',
            password: ''
        }
    }])

    .controller('authSigninController',
        function($scope, $state, AUTH_SERVICE) {
            $scope.signIn = function(credentials) {
                AUTH_SERVICE.signIn(credentials).then(function() {
                    $scope.credentials.password = '';
                });
            };
        })

    .controller('authSignupController',
        function($scope, $state, AUTH_SERVICE) {
            $scope.signUp = function(credentials) {
                AUTH_SERVICE.signUp(credentials)
                    .then(function successCallback() {
                        $scope.credentials = {};
                    });
            };
        });
