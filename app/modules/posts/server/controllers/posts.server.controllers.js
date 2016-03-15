'use strict';

/**
 * Module dependencies.
 */
var express     = require('express'),
    app         = express();

/**
 * Post schema.
 */
var postSchema  = require('../models/posts.server.models');

/**
 * Post create function.
 */
exports.create = function(req, res) {

    var date = new Date().getTime();
    date += (60 * 60 * 1000);

    var post = new postSchema({

        title: req.body.title,
        description: req.body.description,
        image: req.body.image,
        created: new Date(date),
        author: req.body.user

    });

    post.save(function(err) {
        if (err)
        // Error unknown.
            res.json({
                status: 500
            });

        // Complete created.
        res.json({
            status: 200
        })
    });

};

/**
 * Get list posts.
 */
exports.list = function(req, res) {

    postSchema.find().sort('-created').exec(function(err, posts) {
        if(err) {
            res.json({
                status: 500
            })
        } else {
            res.json(posts)
        }
    })

};
