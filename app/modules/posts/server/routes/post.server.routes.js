'use strict';

module.exports = function(app, secure) {

    var postController = require('../controllers/post.server.controllers');

    app.route('/api/v1/posts')
        .get(postController.list)
        .post(secure, postController.create);

    app.route('/api/v1/posts/user/:id')
        .get(secure, postController.listByUser);

};
