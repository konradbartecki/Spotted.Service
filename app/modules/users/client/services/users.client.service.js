angular.module('users')

    .factory('usersFactory', function() {

        return {
            api: {
                login: 'api/v1/auth/signin',
                register: 'api/v1/auth/signup'
            },
            messages: {
                error: {
                    unknown: 'Coś poszło nie tak. Spróbuj ponownie!',
                    conflict: 'Wprowadzone dane są niepoprawne. Spróbuj ponownie.',
                    emailExists: 'Podany adres e-mail jest już zajęty!'
                }
            }
        }

    });
