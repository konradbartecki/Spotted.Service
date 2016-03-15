'use strict';

module.exports = function(app) {

    var core = require('../controllers/core.server.controllers');

    app.route('/*')
        .get(core.index);

};
