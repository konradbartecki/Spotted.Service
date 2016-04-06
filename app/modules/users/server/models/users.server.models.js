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
    password: {
        type: String
    },
    role: String,
    picture: {
        type: String,
        default: '/assets/img/users/placeholder.jpg'
    },
    gender: Number,
    groups: [{
        group: {
            type: ObjectId,
            ref: 'Group'
        }
    }],
    created: {
        type: Date,
        default: Date.now()
    }

});

/**
 * Exports model.
 */
module.exports = mongoose.model('User', userSchema);
