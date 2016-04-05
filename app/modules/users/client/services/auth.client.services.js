angular.module('users')

    .factory('AUTH_SERVICE', function($http, $state, $window, API, AUTH_EVENTS) {
        return {

            signIn: function(credentials) {
                return $http
                    .post(API.auth.signIn, credentials)
                    .then(function successCallback(response) {
                        var token = response.data.token;
                        $window.localStorage.setItem('token', token);
                        AUTH_EVENTS.signInSuccess();
                        $state.go('home');
                    }, function errorCallback(response) {
                        AUTH_EVENTS.signInFailed(response.data.status);
                    });
            },

            signUp: function(credentials) {
                return $http
                    .post(API.auth.signUp, credentials)
                    .then(function successCallback(){
                        AUTH_EVENTS.signUpSuccess();
                        $state.go('auth.signin');
                    }, function errorCallback(response) {
                        AUTH_EVENTS.signUpFailed(response.data.status);
                    });
            }

        }
    })

    .factory('AUTH_EVENTS', function(ALERT_SERVICE) {
        return {

            signInSuccess: function() {
                ALERT_SERVICE.push('success', 'Pomyślnie zalogowano. Witamy na spotted!');
            },

            signInFailed: function(status) {
                switch (status) {
                    case 1401:
                        ALERT_SERVICE.push('error', 'Wprowadzone dane są niepoprawne. Spróbuj ponownie!');
                        break;
                    default:
                        ALERT_SERVICE.push('error', 'Coś poszło nie tak. Spróbuj ponownie!');
                }
            },

            signUpSuccess: function() {
                ALERT_SERVICE.push('success', 'Konto zostało utworzone. Możesz teraz się zalogować!');
            },

            signUpFailed: function(status) {
                switch (status) {
                    case 1402:
                        ALERT_SERVICE.push('error', 'Podany e-mail jest już przypisany do konta spotted!');
                        break;
                    default:
                        ALERT_SERVICE.push('error', 'Coś poszło nie tak. Spróbuj ponownie!');
                }
            }

        }
    });
