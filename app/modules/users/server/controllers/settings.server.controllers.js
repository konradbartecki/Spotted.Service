'use strict';

/**
 * Module dependencies.
 */
var express     = require('express'),
    bcrypt      = require('bcryptjs'),
    app         = express();

var userSchema  = require('../models/users.server.models');

/**
 * Change password function.
 */
exports.changeUserPassword = function(req, res) {
    userSchema.findOne({ _id: req.params.userId }, function(err, user) {
        if(err) {
            // Error unknown.
            res.status(500);
            res.json({ status: 500 });
        } else {
            var hash = bcrypt.hashSync(req.body.newPassword, bcrypt.genSaltSync(10));
            if(bcrypt.compareSync(req.body.password, user.password)) {
                user.password = hash;

                user.save(function(err) {
                    if(err) {
                        // Error unknown.
                        res.status(500);
                        res.json({ status: 500 });
                    } else {
                        // Success.
                        res.status(201);
                        res.json({ status: 201 });
                    }
                });

            } else {
                // Incorrect password
                res.status(500);
                res.json({ status: 1401 });
            }
        }
    });
};

/**
 * Change picture function.
 */
exports.changeUserPicture = function(req, res) {
    userSchema.findOne({ _id: req.params.userId }, function(err, user) {
        if(err) {
            // Error unknown.
            res.status(500);
            res.json({ status: 500 });
        } else {
            user.picture = '/uploads/images/' + req.file.filename;

            user.save(function(err) {
                if(err) {
                    // Error unknown.
                    res.status(500);
                    res.json({ status: 500 });
                } else {
                    // Success
                    res.status(201);
                    res.json({ status: 201 });
                }
            });
        }
    });
};
