var ApiURL = 'api/v1';

angular.module(ApplicationConfiguration.applicationModuleName)
    .constant('API', {
        auth: {
            signIn: ApiURL + '/auth/signin',
            signUp: ApiURL + '/auth/signup'
        },
        users: ApiURL + '/users',
        groups: ApiURL + '/groups',
        posts: ApiURL + '/posts'
    });
