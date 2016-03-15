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
 * User register function.
 */
exports.register = function(req, res) {

    var date = new Date().getTime();
    date += (60 * 60 * 1000);

    var hash = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));

    var user = new userSchema ({
        email: req.body.email,
        password: hash,
        sex: req.body.sex,
        created: new Date(date)
    });

    userSchema.findOne({
        email: req.body.email
    }, function(err, email) {
        if(!email) {
            user.save(function(err) {
                if (err)
                    // Error unknown.
                    res.json({
                        status: 500
                    });

                // Complete register.
                res.json({
                    status: 200
                })
            });
        } else {
            // Email exists.
            res.json({
                status: 409
            })
        }
    });

};

/**
 * User login function.
 */
exports.login = function(req, res) {

    userSchema.findOne({
        email: req.body.email
    }, function(err, user) {
        if(!user) {
            // Incorrect email.
            res.json({
                status: 401
            })
        } else {

            if(bcrypt.compareSync(req.body.password, user.password)) {
                // Token exists 24 hour.
                var token = jwt.sign({
                    user: {
                        id: user._id,
                        email: user.email,
                        created: user.created
                    }
                }, 'token', {
                    expiresIn: 60 * 60 * 24
                });

                // Login complete.
                res.json({
                    status: 200,
                    token: token
                });

            } else {
                // Incorrect password
                res.json({
                    status: 401
                })
            }

        }
    });

};
