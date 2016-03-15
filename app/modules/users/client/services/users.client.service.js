angular.module('users')

    .factory('usersFactory', function() {

        return {
            api: {
                login: 'api/v1/users/login',
                register: 'api/v1/users/register'
            }
        }

    });
