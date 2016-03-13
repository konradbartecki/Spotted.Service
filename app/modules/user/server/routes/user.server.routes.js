'use strict';

module.exports = function(app) {

    var user = require('../controllers/user.server.controllers');

    app.route('/api/v1/user/register')
        .post(user.register);

    app.route('/api/v1/user/login')
        .post(user.login);

};
