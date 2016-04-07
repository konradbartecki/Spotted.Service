'use strict';

module.exports = function(app) {

    var coreController = require('../controllers/core.server.controllers');

    app.route('/*')
        .get(coreController.index);

};
