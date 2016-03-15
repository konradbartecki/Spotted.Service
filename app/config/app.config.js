'use strict';

var mongoose        = require('./lib/mongoose.config'),
    express         = require('./lib/express.config');

// Init database connect.
mongoose.connect();

// Init local variables.
express.initLocalVariables();

// Init middleware.
express.initMiddleware();

// Init view engine.
express.initViewEngine();

// Init server routes.
express.getRoutes();

// Exports server start function.
exports.serverStart = function() {
    // Init listen server function.
    express.listenServer();
};
