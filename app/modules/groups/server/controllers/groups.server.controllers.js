'use strict';

/**
 * Module dependencies.
 */
var express     = require('express'),
    app         = express();

var groupSchema  = require('../models/groups.server.models');

/**
 * Create group.
 */
exports.create = function(req, res) {

    var date = new Date().getTime();

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

/**
 * Get all groups.
 */
exports.get = function(req, res) {
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
 * Get groups by name.
 */
exports.getByName = function(req, res) {
    groupSchema.find({
        "name": {
            "$regex": req.params.groupName,
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
