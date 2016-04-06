angular.module('users')

    .controller('authController', ['$scope',
        function($scope) {

            $scope.data = {
                email: '',
                password: ''
            }

        }])

    .controller('authSignInController',
        function($scope, $state, AUTH_SERVICE) {

            $scope.signIn = function(data) {
                AUTH_SERVICE.signIn(data).then(function() {
                    $scope.data.password = '';
                });
            };

        })

    .controller('authSignUpController',
        function($scope, $state, AUTH_SERVICE) {

            $scope.signUp = function(data) {
                AUTH_SERVICE.signUp(data)
                    .then(function successCallback() {
                        $scope.data = {};
                    });
            };

        });
