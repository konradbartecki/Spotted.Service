'use strict';

/**
 * Module dependencies.
 */
var express     = require('express'),
    bcrypt      = require('bcryptjs'),
    jwt         = require('jsonwebtoken'),
    app         = express();

var userSchema  = require('../models/users.server.models');

/**
 * User sign up function.
 */
exports.signup = function(req, res) {

    var date = new Date().getTime();
    date += (60 * 60 * 1000);

    var hash = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));

    var user = new userSchema ({
        email: req.body.email,
        password: hash,
        created: new Date(date),
        sex: req.body.sex,
        groups: []
    });

    userSchema.findOne({
        email: req.body.email
    }, function(err, email) {
        if(!email) {
            user.save(function(err) {
                if (err) {
                    // Error unknown.
                    res.status(500);
                    res.json({ status: 500, error: err });
                } else {
                    // Register complete.
                    res.status(201);
                    res.json({ status: 201 });
                }
            });
        } else {
            // Email exists.
            res.status(500);
            res.json({ status: 1402 });
        }
    });

};

/**
 * User sign in function.
 */
exports.signin = function(req, res) {

    userSchema.findOne({
        email: req.body.email
    }, function(err, user) {
        if(!user) {
            // Incorrect email.
            res.status(500);
            res.json({ status: 1401 });
        } else {
            if(bcrypt.compareSync(req.body.password, user.password)) {
                // Token exists 24 hour.
                var token = jwt.sign({
                    user: {
                        id: user._id,
                        email: user.email,
                        created: user.created,
                        sex: user.sex,
                        groups: user.groups
                    }
                }, 'ja6ar66eq3fr75raCrareChuwAfaHaja', {
                    expiresIn: 60 * 60 * 24
                });

                // Login complete.
                res.json({
                    token: token
                });

            } else {
                // Incorrect password
                res.status(500);
                res.json({ status: 1401 });
            }

        }
    });

};
