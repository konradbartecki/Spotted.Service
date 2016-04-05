'use strict';

module.exports = function(app) {

    var groupController = require('../controllers/group.server.controllers');

    app.route('/api/v1/groups')
        .get(groupController.list)
        .post(groupController.createGroup);

    app.route('/api/v1/groups/:name')
        .get(groupController.listByName);

};
