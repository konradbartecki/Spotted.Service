'use strict';

/**
 * Module dependencies.
 */
var express     = require('express'),
    moment      = require('moment'),
    app         = express();

var postSchema  = require('../models/post.server.models');

/**
 * Create group function.
 */
exports.create = function(req, res) {

    var date = moment(new Date).add(2, 'h');

    var picture = null;

    if(req.file) {
        picture = '/uploads/images/' + req.file.filename;
    }

    var post = new postSchema ({
        message: req.body.message,
        picture: picture,
        group: req.body.group,
        author: req.body.author,
        created: date
    });

    post.save(function(err) {
        if (err) {
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

/**
 * Get posts list.
 */
exports.list = function(req, res) {

    postSchema.find().sort('-created').populate('author', 'picture').populate('group', 'name').exec(function(err, posts) {
        if(err) {
            res.status(500);
            res.json({ status: 500 });
        } else {
            res.json(posts);
        }
    });

};

/**
 * Get posts by user.
 */
exports.listByUser = function(req, res) {
    postSchema.find({ author: req.params.id }).sort('-created').populate('author', 'picture').populate('group', 'name').exec(function(err, posts) {
        if(err) {
            res.status(500);
            res.json({ status: 500 });
        } else {
            res.json(posts);
        }
    });
};
