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
        type: ObjectId,
        ref: 'Group'
    },
    author: {
        type: ObjectId,
        ref: 'User'
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
