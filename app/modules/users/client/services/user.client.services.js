angular.module('users')

    .factory('USER_SERVICE', function($http, $window, API, $rootScope, $state, USER_EVENTS, Upload) {
        return {

            getCurrentUser: function() {
                return $http({
                    url: API.users + '/' + $rootScope.user.id,
                    method: 'GET',
                    headers: {
                        'x-access-token': $rootScope.token
                    }
                }).then(function(response) {
                    return response.data;
                });
            },

            getUserPosts: function(id) {
                return $http({
                    url: API.posts + '/user/' + id,
                    method: 'GET',
                    headers: {
                        'x-access-token': $rootScope.token
                    }
                }).then(function(response) {
                    return response.data;
                });
            },

            getUserGroups: function() {
                return $http({
                    url: API.users + '/' + $rootScope.user.id + '/group',
                    method: 'GET',
                    headers: {
                        'x-access-token': $rootScope.token
                    }
                }).then(function(response) {
                    return response.data;
                });
            },

            changePassword: function(credentials) {
                $http({
                    url: API.users + '/' + $rootScope.user.id + '/password',
                    method: 'POST',
                    data: {
                        password: credentials.password,
                        newPassword: credentials.newPassword
                    },
                    headers: {
                        'x-access-token': $rootScope.token
                    }
                }).then(function successCallback() {
                    USER_EVENTS.changePasswordSuccess();
                    $window.localStorage.removeItem('token');
                    $rootScope.user = false;
                    $state.go('auth.signin');
                }, function errorCallback(response) {
                    USER_EVENTS.changePasswordFailed(response.data.status);
                });
            },

            changePicture: function(credentials) {
                Upload.upload({
                    url: API.users + '/' + $rootScope.user.id + '/picture',
                    data: {
                        image: credentials.picture
                    },
                    headers: {
                        'x-access-token': $rootScope.token
                    }
                }).then(function successCallback() {
                    USER_EVENTS.changePictureSuccess();
                    $state.reload();
                }, function errorCallback() {
                    USER_EVENTS.changePictureFailed();
                });
            }

        }
    })

    .factory('USER_EVENTS', function(ALERT_SERVICE) {

        return {

            changePasswordSuccess: function() {
                ALERT_SERVICE.push('success', 'Hasło zostało zmienione. Zaloguj się ponownie!');
            },

            changePasswordFailed: function(status) {
                switch (status) {
                    case 1401:
                        ALERT_SERVICE.push('error', 'Aktualne hasło jest nie poprawne. Spróbuj ponownie!');
                        break;
                    default:
                        ALERT_SERVICE.push('error', 'Coś poszło nie tak. Spróbuj ponownie!');
                }
            },

            changePictureSuccess: function() {
                ALERT_SERVICE.push('success', 'Twoje zdjęcie zostało zmienione.');
            },

            changePictureFailed: function() {
                ALERT_SERVICE.push('error', 'Coś poszło nie tak. Spróbuj ponownie!');
            }

        }

    });
