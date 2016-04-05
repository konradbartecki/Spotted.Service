'use strict';

/**
 * Module dependencies.
 */
var express     = require('express'),
    bcrypt      = require('bcryptjs'),
    app         = express();

var userSchema  = require('../models/user.server.models');

/**
 * Get user.
 */
exports.getUser = function(req, res) {

    userSchema.findOne({ _id: req.params.id }, '-password', function(err, user) {
        if(err) {
            res.status(500);
            res.json({});
        } else {
            res.json(user);
        }
    });

};

/**
 * Change password function.
 */
exports.changePassword = function(req, res) {

    userSchema.findOne({ _id: req.params.id }, function(err, user) {

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
exports.changePicture = function(req, res) {

    userSchema.findOne({ _id: req.params.id }, function(err, user) {

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

/**
 * Add group to user.
 */
exports.addUserGroup = function(req, res) {
    userSchema.findOneAndUpdate({ _id: req.params.id }, {$push: {groups: req.body.group}}, {safe: true, upsert: true}).exec(function(err) {
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
};

/**
 * Get user groups.
 */
exports.getUserGroups = function(req, res) {
    userSchema.findOne({ _id: req.params.id }).populate('groups.id').exec(function(err, user) {
        if(err) {
            // Error unknown.
            res.status(500);
            res.json({ status: 500 });
        } else {
            res.json(user.groups);
        }
    })
};
