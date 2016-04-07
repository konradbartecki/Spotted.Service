angular.module('posts')

    .factory('POST_SERVICE', function($http, API, $rootScope, Upload, POST_EVENTS) {
        return {
            getPosts: function() {
                return $http.get(API.posts).then(function(response) {
                    return response.data;
                });
            },
            getSinglePost: function(postId) {
                return $http.get(API.posts + '/' + postId).then(function(response) {
                    return response.data;
                });
            },
            getGroupsByName: function(groupName) {
                return $http.get(API.groups + '/' + groupName).then(function(response) {
                    return response.data;
                });
            },
            createPost: function(data) {
                return $http({
                    url: API.posts,
                    method: 'POST',
                    data: {
                        message: data.message,
                        group: data.group[0]._id,
                        author: $rootScope.user.id
                    },
                    headers: {
                        'x-access-token': $rootScope.token
                    }
                }).then(function successCallback() {
                    POST_EVENTS.createPostSuccess();
                }, function errorCallback(response) {
                    POST_EVENTS.createPostFailed();
                    console.log(response);
                });
            },
            createPostUpload: function(data) {
                return Upload.upload({
                    url: API.posts,
                    data: {
                        message: data.message,
                        image: data.picture,
                        group: data.group[0]._id,
                        author: $rootScope.user.id
                    },
                    headers: {
                        'x-access-token': $rootScope.token
                    }
                }).then(function successCallback() {
                    POST_EVENTS.createPostSuccess();
                }, function errorCallback() {
                    POST_EVENTS.createPostFailed();
                });
            },
            deactivatePost: function(postId) {
                return $http({
                    url: API.posts + '/' + postId + '/deactivate',
                    method: 'PUT',
                    headers: {
                        'x-access-token': $rootScope.token
                    }
                }).then(function successCallback() {
                    POST_EVENTS.deactivatePostSuccess();
                }, function errorCallback() {
                    POST_EVENTS.deactivatePostFailed();
                });
            }
        }
    })

    .factory('POST_EVENTS', function(ALERT_SERVICE) {
        return {

            createPostSuccess: function() {
                ALERT_SERVICE.push('success', 'Ogłoszenie zostało pomyślnie dodane.');
            },
            createPostFailed: function() {
                ALERT_SERVICE.push('error', 'Coś poszło nie tak. Spróbuj ponownie!');
            },
            deactivatePostSuccess: function() {
                ALERT_SERVICE.push('success', 'Ogłoszenie zostało pomyślnie dezaktywnowane!');
            },
            deactivatePostFailed: function() {
                ALERT_SERVICE.push('error', 'Coś poszło nie tak. Spróbuj ponownie!');
            }

        }
    });
