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
var commentSchema = new Schema({

    id: ObjectId,
    message: String,
    post: {
        type: ObjectId,
        ref: 'Post'
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
module.exports = mongoose.model('Comment', commentSchema);
