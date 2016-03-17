angular.module('users')

    .factory('usersFactory', function() {

        return {
            api: {
                login: 'api/v1/auth/signin',
                register: 'api/v1/auth/signup'
            }
        }

    });
