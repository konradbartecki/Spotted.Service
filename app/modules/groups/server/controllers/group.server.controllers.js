'use strict';

/**
 * Module dependencies.
 */
var express     = require('express'),
    moment      = require('moment'),
    app         = express();

var groupSchema  = require('../models/group.server.models');

/**
 * Get groups.
 */
exports.list = function(req, res) {
    groupSchema.find(function(err, groups) {
        if(err) {
            res.status(500);
            res.json({ status: 500 });
        } else {
            res.json(groups);
        }
    });
};

/**
 * List group by partial name.
 */
exports.listByName = function(req, res) {
    groupSchema.find({
        "name": {
            "$regex": req.params.name,
            "$options": "i"
        }
    }, function(err, groups) {
        if(err) {
            res.status(500);
            res.json({ status: 500 });
        } else {
            res.json(groups);
        }
    })
};

/**
 * Create group function.
 */
exports.createGroup = function(req, res) {

    var date = moment(new Date).add(2, 'h');

    var group = new groupSchema ({
        name: req.body.name,
        province: req.body.province,
        location: {
            latitude: req.body.location.latitude,
            longitude: req.body.location.longitude
        },
        created: date
    });

    group.save(function(err) {
        if(err) {
            // Error unknown.
            res.status(500);
            res.json({ status: 500 });
        } else {
            // Group created
            res.status(201);
            res.json({ status: 201 });
        }
    });

};
