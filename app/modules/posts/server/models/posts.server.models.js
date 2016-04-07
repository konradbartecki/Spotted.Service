'use strict';

/**
 * Module dependencies.
 */
var mongoose    = require('mongoose'),
    Schema      = mongoose.Schema,
    ObjectId    = Schema.ObjectId;

/**
 * Group schema.
 */
var postSchema = new Schema({

    id: ObjectId,
    message: String,
    picture: String,
    group: {
        id: {
            type: ObjectId,
            ref: 'Group'
        },
        name: String
    },
    author: {
        type: ObjectId,
        ref: 'User'
    },
    active: {
        type: Boolean,
        default: true
    },
    created: {
        type: Date,
        default: Date.now()
    }

});

/**
 * Exports model.
 */
module.exports = mongoose.model('Post', postSchema);
