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
    sex: Number,
    created: {
        type: Date,
        default: Date.now()
    }

});

/**
 * Exports model.
 */
module.exports = mongoose.model('User', userSchema);
