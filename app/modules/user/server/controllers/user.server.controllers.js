'use strict';

/**
 * Module dependencies.
 */
var express     = require('express'),
    bcrypt      = require('bcryptjs'),
    userSchema  = require('../models/user.server.models'),
    jwt         = require('jsonwebtoken'),
    app         = express();


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
        created: new Date(date)
    });

    userSchema.findOne({
        email: req.body.email
    }, function(err, email) {
        if(!email) {
            user.save(function(err) {
                if (err)
                    res.json({
                        message: {
                            error: 'Coś poszło nie tak! Spróbuj ponownie.'
                        }
                    });

                res.json({
                    message: {
                        success: 'Konto zostało utworzone.'
                    }
                })
            });
        } else {
            res.json({
                message: {
                    error: 'Do podanego adresu e-mail jest już przypisane konto.'
                }
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
            res.json({
                message: {
                    error: 'W naszej bazie nie ma użytkownika o podanym adresie e-mail.'
                }
            })
        } else {

            if(bcrypt.compareSync(req.body.password, user.password)) {

                var token = jwt.sign(user, 'token', {
                    expiresIn: 60 * 60 * 24
                });

                res.json({
                    message: {
                        success: 'Zalogowano pomyślnie!'
                    },
                    token: token
                });

            } else {
                res.json({
                    message: {
                        error: 'Podane hasło jest niepoprawne! Spróbuj ponownie.'
                    }
                })
            }

        }
    });

};
