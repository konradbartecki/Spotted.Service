angular.module('groups')
    .factory('GROUP_SERVICE', function($http, API, $rootScope, GROUP_EVENTS) {
        return {
            getGroups: function() {
                return $http.get(API.groups).then(function(response) {
                    return response.data;
                });
            },
            joinToGroup: function(id) {
                return $http({
                    url: API.users + '/' + $rootScope.user.id + '/group',
                    method: 'POST',
                    data: { group: {id: id} },
                    headers: {
                        'x-access-token': $rootScope.token
                    }
                }).then(function successCallback() {
                    GROUP_EVENTS.joinToGroupSuccess();
                }, function errorCallback() {
                    GROUP_EVENTS.joinToGroupFailed();
                });
            }
        }
    })

    .factory('GROUP_EVENTS', function(ALERT_SERVICE) {
        return {

            joinToGroupSuccess: function() {
                ALERT_SERVICE.push('success', 'Groupa została pomyślnie dodana!');
            },

            joinToGroupFailed: function() {
                ALERT_SERVICE.push('error', 'Coś poszło nie tak. Spróbuj ponownie!');
            }

        }
    });
