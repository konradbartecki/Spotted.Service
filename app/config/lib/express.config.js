'use strict';

/**
 * Module dependencies.
 */
var path            = require('path'),
    bodyParser      = require('body-parser'),
    methodOverride  = require('method-override'),
    swig            = require('swig'),
    multer          = require('multer'),
    crypto          = require('crypto'),
    jwt             = require('jsonwebtoken'),
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


    var storage = multer.diskStorage({
        destination: './public/uploads/images/posts/',
        filename: function (req, file, cb) {
            crypto.pseudoRandomBytes(16, function (err, raw) {
                if (err) {
                    res.send(err);
                    return;
                }
                cb(null, raw.toString('hex') + path.extname(file.originalname))
            })
        }
    });
    var upload = multer({ storage: storage }).single('image');

    app.use(upload);
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
 * Secure function for routes.
 */
var secure = function(req, res, next) {

    var token = req.body.token || req.query.token || req.headers['x-access-token'];

    if(token) {
        jwt.verify(token, 'ja6ar66eq3fr75raCrareChuwAfaHaja', function(err, decoded) {
            if(err) {
                // Unauthorized
                res.status(401);
                res.json({ status: 401 });
            } else {
                req.decoded = decoded;
                next();
            }
        })
    } else {
        // Unauthorized
        res.status(401);
        res.json({ status: 401 });
    }

};

/**
 * Initialize server routes.
 */
exports.getRoutes = function() {
    var routes = env.getGlobbedPaths(env.app.server.assets.routes);

    routes.forEach(function(routePath) {
        require(path.resolve(routePath))(app, secure);
    });
};

/**
 * Listen server.
 */
exports.listenServer = function() {
    app.listen(env.app.server.config.host.port || env.app.server.config.host.ip);
};
