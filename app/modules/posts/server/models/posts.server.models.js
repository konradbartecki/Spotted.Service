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
var postSchema = new Schema({

    id: ObjectId,
    description: String,
    image: String,
    created: {
        type: Date,
        default: Date.now()
    },
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
    }

});

/**
 * Exports model.
 */
module.exports = mongoose.model('Post', postSchema);
