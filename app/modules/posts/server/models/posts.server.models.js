'use strict';

/**
 * Module dependencies.
 */
var mongoose    = require('mongoose'),
    Schema      = mongoose.Schema,
    ObjectId    = Schema.ObjectId;

/**
 * User schema.
 */
var postSchema = new Schema({

    id: ObjectId,
    title: String,
    description: String,
    image: String,
    created: {
        type: Date,
        default: Date.now()
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
