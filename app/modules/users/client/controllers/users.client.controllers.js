angular.module('users')

    .controller('signinController', ['$scope', '$http', 'usersFactory', '$window', '$state',
        function($scope, $http, usersFactory, $window, $state) {
            $scope.signin = function() {
                $http({
                    url: usersFactory.api.login,
                    method: 'POST',
                    data: $scope.user
                }).then(function(response) {
                    var status = response.data.status;
                    if(status === 200) {
                        $window.localStorage.setItem('token', response.data.token);

                        $state.go('home');
                    } else if(status === 401) {
                        $scope.error = 'Adres e-mail lub hasło są nieprawidłowe!';
                    }
                })
            };
        }])

    .controller('signupController', ['$scope', '$http', 'usersFactory', '$state',
        function($scope, $http, usersFactory, $state) {
            $scope.signup = function() {
                $http({
                    url: usersFactory.api.register,
                    method: 'POST',
                    data: $scope.user
                }).then(function(response) {
                    console.log($scope.user);
                    var status = response.data.status;
                    if(status === 200) {
                        $state.go('authentication.signin');
                    } else if(status === 409) {
                        $scope.error = 'Do podanego adresu e-mail jest już przypisane konto użytkownika w naszym serwisie!';
                    }
                })
            };
        }]);
