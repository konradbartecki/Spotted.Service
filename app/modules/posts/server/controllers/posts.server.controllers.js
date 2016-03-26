'use strict';

/**
 * Module dependencies.
 */
var express     = require('express'),
    app         = express();

var postSchema  = require('../models/posts.server.models'),
    groupSchema = require('../../../groups/server/models/groups.server.models.js'),
    userSchema  = require('../../../users/server/models/users.server.models.js');

/**
 * Get posts.
 */
exports.get = function(req, res) {
    postSchema.find(function(err, posts) {
        if(err) {
            res.send(err);
        } else {
            res.json(posts);
        }
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
        group: req.body.group,
        author: req.body.user

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
 * Get post.
 */
exports.getPost = function(req, res) {
    postSchema.findOne({ _id : req.params.id }, function(err, post) {
        if(err) {
            res.send(err);
        } else {
            res.json(post);
        }
    });
};

/**
 * Get post category.
 */
exports.getPostGroup = function(req, res) {

    postSchema.findOne({ _id : req.params.id }, function(err, post) {
        if(err) {
            res.send(err);
        } else {
            groupSchema.findOne({ _id : post.group }, function(err, group) {
                if(err) {
                    res.send(err);
                } else {
                    res.json(group);
                }
            });
        }
    });

};

/**
 * Get post author.
 */
exports.getPostAuthor = function(req, res) {

    postSchema.findOne({ _id : req.params.id }, function(err, post) {
        if(err) {
            res.send(err);
        } else {
            userSchema.findOne({ _id : post.author }, function(err, user) {
                if(err) {
                    res.send(err);
                } else {
                    res.json(user);
                }
            });
        }
    });

};
