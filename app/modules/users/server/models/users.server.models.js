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
var userSchema = new Schema({

    id: ObjectId,
    email: {
        type: String,
        unique: true
    },
    password: String,
    created: {
        type: Date,
        default: Date.now()
    },
    sex: Number,
    groups: []

});

/**
 * Exports model.
 */
module.exports = mongoose.model('User', userSchema);
