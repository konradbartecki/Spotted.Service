'use strict';

var _       = require('lodash'),
    glob    = require('glob');


module.exports = {
    app: {
        server: {
            config: {
                host: {
                    ip: 'localhost',
                    port: '3000'
                },
                db: {
                    uri: 'mongodb://localhost/spotted'
                }
            },
            assets: {
                routes: ['app/modules/!(core)/server/routes/**/*.js', 'app/modules/core/server/routes/**/*.js'],
                models: 'app/modules/**/server/models/**/*.js'
            }
        }
    }
};

module.exports.getGlobbedPaths = function(globPatterns, excludes) {
    // URL paths regex
    var urlRegex = new RegExp('^(?:[a-z]+:)?\/\/', 'i');

    // The output array
    var output = [];

    // If glob pattern is array so we use each pattern in a recursive way, otherwise we use glob
    if (_.isArray(globPatterns)) {
        globPatterns.forEach(function (globPattern) {
            output = _.union(output, module.exports.getGlobbedPaths(globPattern, excludes));
        });
    } else if (_.isString(globPatterns)) {
        if (urlRegex.test(globPatterns)) {
            output.push(globPatterns);
        } else {
            var files = glob.sync(globPatterns);
            if (excludes) {
                files = files.map(function (file) {
                    if (_.isArray(excludes)) {
                        for (var i in excludes) {
                            file = file.replace(excludes[i], '');
                        }
                    } else {
                        file = file.replace(excludes, '');
                    }
                    return file;
                });
            }
            output = _.union(output, files);
        }
    }

    return output;
};
