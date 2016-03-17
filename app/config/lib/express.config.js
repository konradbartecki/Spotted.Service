'use strict';

/**
 * Module dependencies.
 */
var path            = require('path'),
    bodyParser      = require('body-parser'),
    methodOverride  = require('method-override'),
    swig            = require('swig'),
    express         = require('express'),
    app             = express();

/**
 * Include environment.
 */
var env             = require('../env/env.config');

/**
 * Initialize local variables.
 */
exports.initLocalVariables = function() {
    app.locals.title = env.app.client.site.title;
    app.locals.description = env.app.client.site.description;
    app.locals.styles = {
        vendor: env.app.client.site.stylesheets.vendor,
        app: env.app.client.site.stylesheets.app
    };
    app.locals.scripts = {
        vendor: env.app.client.site.scripts.vendor,
        app: env.app.client.site.scripts.app
    };
};

/**
 * Initialize middleware.
 */
exports.initMiddleware = function () {
    // Define public directory.
    app.use('/assets', express.static(path.join(env.app.client.public.assets)));
    app.use('/uploads', express.static(path.join(env.app.client.public.uploads)));

    // Define public client views
    var clientViews = env.getGlobbedPaths(env.app.client.public.views);

    clientViews.forEach(function(view){
        app.use('/' + view, express.static(path.join(view)));
    });

    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(bodyParser.json());
    app.use(methodOverride());
};

/**
 * Initialize views engine.
 */
exports.initViewEngine = function() {
    swig.setDefaults({
        cache: false
    });

    app.engine('server.view.html', swig.renderFile);
    app.set('view engine', 'server.view.html');
    app.set('views', './')
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
