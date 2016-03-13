'use strict';

var mongoose        = require('./lib/mongoose.config'),
    express         = require('./lib/express.config');

// Init database connect.
mongoose.connect();

// Init middleware.
express.initMiddleware();

// Init server routes.
express.getRoutes();

// Exports server start function.
exports.serverStart = function() {
    // Init listen server function.
    express.listenServer();
};
