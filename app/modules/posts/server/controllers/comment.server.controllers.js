'use strict';

/**
 * Module dependencies.
 */
var express     = require('express'),
    moment      = require('moment'),
    app         = express();

var commentSchema  = require('../models/comment.server.models');

/**
 * Get all comments.
 */
exports.list = function(req, res) {
    commentSchema.find({ post: req.params.id }).sort({ created: 'desc' }).populate('author', 'picture').exec(function(err, comments) {
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
    var date = moment(new Date).add(2, 'h');

    var comment = new commentSchema ({
        message: req.body.message,
        post: req.params.id,
        author: req.body.author,
        created: date
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
    commentSchema.findOne({ _id: req.params.id }).exec(function(err, comment) {
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

/**
 * Get comments by limit.
 */
exports.listByLimit = function(req, res) {
    commentSchema.find({ post: req.params.id }).limit(parseInt(req.params.limitTo)).sort({ created: 'desc' }).populate('author', 'picture').exec(function(err, comments) {
        if(err) {
            res.status(500);
            res.json(err);
        } else {
            res.json(comments);
        }
    });
};
