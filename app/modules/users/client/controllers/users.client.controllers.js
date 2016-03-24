angular.module('users')

    .controller('authController', ['$scope', '$uibModalInstance', '$uibModal', function($scope, $uibModalInstance, $uibModal) {

        $scope.closeModal = function() {
            $uibModalInstance.dismiss('cancel');
        };

        $scope.switchModal = function(tpl) {
            $scope.closeModal();
            $uibModal.open({
                animation: false,
                templateUrl: 'app/modules/users/client/views/authentication/' + tpl + '/' + tpl + '.client.view.html',
                controller: 'authController',
                size: 'lg'
            });
        };

    }])

    .controller('signinController', ['$scope', '$http', 'usersFactory', '$window', '$state',
        function($scope, $http, usersFactory, $window, $state) {
            $scope.message = {};

            $scope.signin = function() {
                $http({
                    url: usersFactory.api.login,
                    method: 'POST',
                    data: $scope.user
                }).then(function successCallback(response) {
                    $window.localStorage.setItem('token', response.data.token);
                    $scope.closeModal();
                    $state.go('posts');
                }, function errorCallback(response) {
                    var status = response.status;
                    if(status == 400) {
                        $scope.message.error = usersFactory.messages.error.unknown;
                    } else if(status == 401) {
                        $scope.message.error = usersFactory.messages.error.conflict;
                    }
                });
            };
        }])

    .controller('signupController', ['$scope', '$http', 'usersFactory', '$uibModal',
        function($scope, $http, usersFactory, $uibModal) {
            $scope.message = {};

            $scope.signup = function() {
                $http({
                    url: usersFactory.api.register,
                    method: 'POST',
                    data: $scope.user
                }).then(function successCallback() {
                    $scope.closeModal();
                    $uibModal.open({
                        animation: false,
                        templateUrl: 'app/modules/users/client/views/authentication/signin/signin.client.view.html',
                        controller: 'authController',
                        size: 'lg'
                    });
                }, function errorCallback(response) {
                    var status = response.status;
                    if(status == 400 || status == 500) {
                        $scope.message.error = usersFactory.messages.error.unknown;
                    } else if(status == 409) {
                        $scope.message.error = usersFactory.messages.error.emailExists;
                    }
                });
            };
        }]);
