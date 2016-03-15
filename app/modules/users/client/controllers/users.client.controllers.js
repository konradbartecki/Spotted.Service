angular.module('users')

    .controller('loginController', ['$scope', '$http', 'usersFactory', '$window', '$state',
        function($scope, $http, usersFactory, $window, $state) {
            $scope.login = function() {
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
                        console.log('Podany adres e-mail lub hasło są nieprawidłowe!');
                    }
                })
            };
        }])

    .controller('registerController', ['$scope', '$http', 'usersFactory', '$state',
        function($scope, $http, usersFactory, $state) {
            $scope.user = {
                email: '',
                password: '',
                sex: ''
            };
            $scope.register = function() {
                $http({
                    url: usersFactory.api.register,
                    method: 'POST',
                    data: $scope.user
                }).then(function(response) {
                    console.log($scope.user);
                    var status = response.data.status;
                    if(status === 200) {
                        $state.go('login');
                    } else if(status === 409) {
                        console.log('Do podanego adresu e-mail przypisane jest już konto użytkownika!!');
                    }
                })
            };
        }]);
