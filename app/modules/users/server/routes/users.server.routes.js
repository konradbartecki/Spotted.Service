'use strict';

module.exports = function(app) {

    var usersController = require('../controllers/users.server.controllers');

    app.route('/api/v1/auth/signup')
        .post(usersController.signup);

    app.route('/api/v1/auth/signin')
        .post(usersController.signin);

};
