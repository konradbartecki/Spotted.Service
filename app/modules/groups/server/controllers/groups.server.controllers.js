'use strict';

/**
 * Module dependencies.
 */
var express     = require('express'),
    app         = express();

var groupSchema  = require('../models/groups.server.models');

/**
 * Get groups function.
 */
exports.get = function(req, res) {
    groupSchema.find(function(err, groups){
        if(err) {
            res.send(err);
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
        name: {
            "$regex": req.params.name,
            "$options": "i"
        }
    }, function(err, groups) {
        if(err) {
            res.send(err);
        } else {
            res.json(groups);
        }
    });
};

/**
 * Create group function.
 */
exports.create = function(req, res) {

    var date = new Date().getTime();
    date += (60 * 60 * 1000);

    var group = new groupSchema ({

        name: req.body.name,
        province: req.body.province,
        location: {
            latitude: req.body.latitude,
            longitude: req.body.longitude
        },
        created: date

    });

    group.save(function(err) {
        if(err) {
            res.status(500);
            res.json({ status: 500 });
        } else {
            res.status(201);
            res.json({ status: 201 });
        }
    });

};
