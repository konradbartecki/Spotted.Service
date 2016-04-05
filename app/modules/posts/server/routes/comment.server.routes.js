'use strict';

module.exports = function(app, secure) {

    var commentController = require('../controllers/comment.server.controllers');

    app.route('/api/v1/posts/:id/comments')
        .get(commentController.list)
        .post(secure, commentController.create);

    app.route('/api/v1/posts/:id/comments/:limitTo')
        .get(commentController.listByLimit);

    app.route('/api/v1/posts/comments/:id')
        .delete(secure, commentController.delete);

};
