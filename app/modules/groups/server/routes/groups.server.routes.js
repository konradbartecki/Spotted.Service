'use strict';

module.exports = function(app) {

    var groupsController = require('../controllers/groups.server.controllers');

    app.route('/api/v1/groups')
        .get(groupsController.get)
        .post(groupsController.create);

    app.route('/api/v1/groups/:groupName')
        .get(groupsController.getByName);

};
