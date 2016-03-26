'use strict';

module.exports = function(app, secure) {

    var postsController = require('../controllers/posts.server.controllers');

    app.route('/api/v1/posts')
        .post(secure, postsController.create)
        .get(secure, postsController.get);

    app.route('/api/v1/posts/:id')
        .get(secure, postsController.getPost);

    app.route('/api/v1/posts/:id/group')
        .get(secure, postsController.getPostGroup);

    app.route('/api/v1/posts/:id/author')
        .get(secure, postsController.getPostAuthor);

};
