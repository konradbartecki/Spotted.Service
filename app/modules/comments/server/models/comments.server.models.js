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
var commentSchema = new Schema({

    id: ObjectId,
    message: String,
    created: {
        type: Date,
        default: Date.now()
    },
    post: {
        type: ObjectId,
        ref: 'Post'
    },
    author: {
        type: ObjectId,
        ref: 'User'
    }

});

/**
 * Exports model.
 */
module.exports = mongoose.model('Comment', commentSchema);
