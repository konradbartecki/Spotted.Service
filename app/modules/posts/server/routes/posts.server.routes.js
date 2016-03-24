'use strict';

module.exports = function(app, secure) {

    var postsController = require('../controllers/posts.server.controllers');

    app.route('/api/v1/posts')
        .post(secure, postsController.create)
        .get(secure, postsController.get);

};
