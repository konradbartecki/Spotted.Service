'use strict';

module.exports = function(app, secure) {

    var usersController = require('../controllers/users.server.controllers'),
        usersSettingsController = require('../controllers/settings.server.controllers');

    // Get single user.
    app.route('/api/v1/users/:userId')
        .get(secure, usersController.getUser);

    // Get user posts.
    app.route('/api/v1/users/:userId/posts')
        .get(secure, usersController.getUserPosts);

    // Change user password
    app.route('/api/v1/users/:userId/password')
        .post(secure, usersSettingsController.changeUserPassword);

    // Change user picture
    app.route('/api/v1/users/:userId/picture')
        .post(secure, usersSettingsController.changeUserPicture);


};
