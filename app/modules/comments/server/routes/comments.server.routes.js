'use strict';

module.exports = function(app, secure) {

    var commentsController = require('../controllers/comments.server.controllers');

    app.route('/api/v1/comments')
        .post(secure, commentsController.post);

};
