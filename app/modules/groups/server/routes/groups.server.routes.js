'use strict';

module.exports = function(app, secure) {

    var groupsController = require('../controllers/groups.server.controllers');

    app.route('/api/v1/groups')
        .post(groupsController.create)
        .get(secure, groupsController.get);

};
