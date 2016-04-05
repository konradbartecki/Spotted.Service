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
    picture: {
        type: String,
        default: '/assets/img/users/placeholder.jpg'
    },
    created: Date,
    gender: Number,
    groups: [{
        id: {
            type: String,
            ref: 'Group'
        }
    }]

});

/**
 * Exports model.
 */
module.exports = mongoose.model('User', userSchema);
