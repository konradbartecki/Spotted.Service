'use strict';

/**
 * Module dependencies.
 */
var path            = require('path'),
    bodyParser      = require('body-parser'),
    methodOverride  = require('method-override'),
    express         = require('express'),
    app             = express();

/**
 * Include environment.
 */
var env             = require('../env/env.config');


/**
 * Initialize middleware.
 */
exports.initMiddleware = function () {

    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(bodyParser.json());
    app.use(methodOverride());

};

/**
 * Initialize server routes.
 */
exports.getRoutes = function() {
    var routes = env.getGlobbedPaths(env.app.server.assets.routes);

    routes.forEach(function(routePath) {
        require(path.resolve(routePath))(app);
    });
};

/**
 * Listen server.
 */
exports.listenServer = function() {
    app.listen(env.app.server.config.host.port || env.app.server.config.host.ip);
};
