'use strict';

/**
 * Module dependencies.
 */
var express     = require('express'),
    app         = express();

var userSchema  = require('../models/users.server.models'),
    postSchema  = require('../../../posts/server/models/posts.server.models');

/**
 * Get user.
 */
exports.getUser = function(req, res) {
    userSchema.findOne({ _id: req.params.userId }, '-password', function(err, user) {
        if(err) {
            res.status(500);
            res.json({});
        } else {
            res.json(user);
        }
    });
};

/**
 * Get user groups.
 */
exports.getUserPosts = function(req, res) {
    postSchema.find({ author: req.params.userId }).sort('-created').populate('author', 'picture').populate('group', 'name').exec(function(err, posts) {
        if(err) {
            res.status(500);
            res.json({ status: 500 });
        } else {
            res.json(posts);
        }
    });
};


