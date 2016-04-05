'use strict';

module.exports = function(app) {

    var authController = require('../controllers/auth.server.controllers');

    app.route('/api/v1/auth/signup')
        .post(authController.signup);

    app.route('/api/v1/auth/signin')
        .post(authController.signin);

};
