'use strict';

/**
 * Module dependencies.
 */
var express     = require('express'),
    app         = express();

var commentsSchema  = require('../models/comments.server.models');

/**
 * Get all comments.
 */
exports.get = function(req, res) {
    commentsSchema.find({ post: req.params.postId }).sort({ created: 'desc' }).populate('author', 'picture').exec(function(err, comments) {
        if(err) {
            res.status(500);
            res.json({ status: 500 });
        } else {
            res.json(comments);
        }
    });
};

/**
 * Create comment.
 */
exports.create = function(req, res) {

    var comment = new commentsSchema ({
        message: req.body.message,
        post: req.params.postId,
        author: req.body.author
    });

    comment.save(function(err) {
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
 * Delete comment.
 */
exports.delete = function(req, res) {
    commentsSchema.findOne({ _id: req.params.commentId }).exec(function(err, comment) {
        if(err) {
            res.status(500);
            res.json({ status: 500 });
        } else {
            comment.remove(function(err) {
                if(err) {
                    res.status(500);
                    res.json({ status: 500 });
                } else {
                    res.status(200);
                    res.json({ status: 200 });
                }
            });
        }
    });
};
