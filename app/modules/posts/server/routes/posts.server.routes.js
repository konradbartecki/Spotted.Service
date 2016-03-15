'use strict';

module.exports = function(app) {

    var post = require('../controllers/posts.server.controllers.js');

    app.route('/api/v1/posts')
        .get(post.list)
        .post(post.create);

};
