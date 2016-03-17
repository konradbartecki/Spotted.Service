'use strict';

module.exports = function(app) {

    var user = require('../controllers/users.server.controllers');

    app.route('/api/v1/auth/signup')
        .post(user.signup);

    app.route('/api/v1/auth/signin')
        .post(user.signin);

};
