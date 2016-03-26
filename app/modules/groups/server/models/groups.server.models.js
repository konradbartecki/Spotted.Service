'use strict';

/**
 * Module dependencies.
 */
var mongoose    = require('mongoose'),
    Schema      = mongoose.Schema,
    ObjectId    = Schema.ObjectId;

/**
 * Posts schema.
 */
var groupSchema = new Schema({

    id: ObjectId,
    name: String,
    province: String,
    location: {
        latitude: Number,
        longitude: Number
    },
    created: {
        type: Date,
        default: Date.now()
    }

});

/**
 * Exports model.
 */
module.exports = mongoose.model('Group', groupSchema);
