'use strict';

var mongoose    = require('mongoose'),
    Schema      = mongoose.Schema,
    ObjectId    = Schema.ObjectId;

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
    }

});


module.exports = mongoose.model('User', userSchema);


