'use strict';

module.exports = function(app, secure) {

    var postsController = require('../controllers/posts.server.controllers'),
        commentsController = require('../controllers/comments.server.controllers');

    // Get and create posts.
    app.route('/api/v1/posts')
        .get(postsController.get)
        .post(secure, postsController.create);

    // Get and create comments.
    app.route('/api/v1/posts/:postId/comments')
        .get(commentsController.get)
        .post(secure, commentsController.create);

    // Delete comment.
    app.route('/api/v1/posts/comments/:commentId')
        .delete(secure, commentsController.delete);

};
