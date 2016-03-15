'use strict';

module.exports = function(app) {

    var user = require('../controllers/users.server.controllers');

    app.route('/api/v1/users/register')
        .post(user.register);

    app.route('/api/v1/users/login')
        .post(user.login);

};
