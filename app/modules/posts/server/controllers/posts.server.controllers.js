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
 * Get single post.
 */
exports.getSingle = function(req, res) {
    postSchema.findOne({ _id: req.params.postId }).populate('author', 'picture').populate('group', 'name').exec(function(err, post) {
        if(err) {
            res.status(500);
            res.json({ status: 500 });
        } else {
            res.json(post);
        }
    });
};

/**
 * Create post.
 */
exports.create = function(req, res) {

    var date = new Date().getTime();

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
 * Post deactivate.
 */
exports.deactivate = function(req, res) {
    postSchema.findOne({ _id: req.params.postId }, function(err, post) {
        if(err) {
            res.status(500);
            res.json({ status: 500 });
        } else {
            post.active = false;
            post.save(function(err) {
                if(err) {
                    res.status(500);
                    res.json({ status: 500 });
                } else {
                    res.status(201);
                    res.json({ status: 201 });
                }
            })
        }
    });
};
