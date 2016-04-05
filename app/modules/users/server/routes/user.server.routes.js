'use strict';

module.exports = function(app, secure) {

    var userController = require('../controllers/user.server.controllers');

    app.route('/api/v1/users/:id')
        .get(secure, userController.getUser);

    app.route('/api/v1/users/:id/password')
        .post(secure, userController.changePassword);

    app.route('/api/v1/users/:id/picture')
        .post(secure, userController.changePicture);

    app.route('/api/v1/users/:id/group')
        .get(secure, userController.getUserGroups)
        .post(secure, userController.addUserGroup);


};
