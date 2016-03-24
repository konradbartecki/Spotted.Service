'use strict';

/**
 * Module dependencies.
 */
var express     = require('express'),
    app         = express();

var postSchema  = require('../models/posts.server.models');

/**
 * Get posts.
 */
exports.get = function(req, res) {
    res.json({
        test: 'dziala routing'
    });
};

/**
 * Create posts.
 */
exports.create = function(req, res) {

    var date = new Date().getTime();
    date += (60 * 60 * 1000);

    var image = null;

    if(req.file) {
        image = '/uploads/images/posts/' + req.file.filename;
    }

    var post = new postSchema ({

        description: req.body.description,
        image: image,
        created: date,
        author: req.body.user

    });

    post.save(function(err) {
        if (err) {
            // Error unknown.
            res.status(500);
            res.json({ status: 500 });
        } else {
            // Register complete.
            res.status(200);
            res.json({ status: 200 });
        }
    });

};
