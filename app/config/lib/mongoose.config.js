'use strict';

/**
 * Module dependencies.
 */
var mongoose    = require('mongoose'),
    path        = require('path');

/**
 * Include environment.
 */
var env     = require('../env/env.config');

/**
 * Database connect.
 */
exports.connect = function() {
    mongoose.connect(env.app.server.config.db.uri);
};
