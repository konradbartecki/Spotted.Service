'use strict';

/**
 * Module dependencies.
 */
var express     = require('express'),
    app         = express();

var commentSchema  = require('../models/comments.server.models');

/**
 * Get comments.
 */
exports.post = function(req, res) {
    var date = new Date().getTime();
    date += (60 * 60 * 1000);

    var comment = new commentSchema ({
        message: req.body.message,
        created: date,
        post: req.body.post,
        author: req.body.user
    });

    comment.save(function(err) {
        if(err) {
            // Error unknown.
            res.status(500);
            res.json({ status: 1500 });
        } else {
            // Created
            res.status(201);
            res.json({ status: 201 });
        }
    });
};
