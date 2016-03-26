'use strict';

/**
 * Module dependencies.
 */
var gulp        = require('gulp'),
    sass        = require('gulp-sass'),
    concat      = require('gulp-concat'),
    minifyCss   = require('gulp-minify-css'),
    minifyJs    = require('gulp-minify'),
    plumber     = require('gulp-plumber');

/**
 * Directory configuration.
 */
var config = {
    appDir: './app',
    assetsDir: './assets',
    bowerDir: './bower_components',
    npmDir: './node_modules',
    publicDir: './public'
};

/**
 * Task for vendor scripts dependencies.
 */
gulp.task('js:vendor', function() {
    return gulp.src([
            config.bowerDir + '/jquery/dist/jquery.min.js',
            config.bowerDir + '/bootstrap/dist/js/bootstrap.min.js',
            config.bowerDir + '/bootstrap-select/bootstrap-select.min.js',
            config.bowerDir + '/moment/min/moment-with-locales.min.js',
            config.bowerDir + '/angular/angular.min.js',
            config.bowerDir + '/angular-ui-router/release/angular-ui-router.js',
            config.bowerDir + '/angular-jwt/dist/angular-jwt.js',
            config.bowerDir + '/ng-file-upload/ng-file-upload.min.js',
            config.bowerDir + '/angular-bootstrap/ui-bootstrap.min.js',
            config.bowerDir + '/angular-bootstrap/ui-bootstrap-tpls.min.js',
            config.bowerDir + '/angular-bootstrap-select/build/angular-bootstrap-select.min.js',
            config.bowerDir + '/angular-moment/angular-moment.min.js'
        ])
        .pipe(concat('vendor.js'))
        .pipe(minifyJs({exclude: ['tasks']}))
        .pipe(gulp.dest(config.publicDir + '/assets/js'));
});

/**
 * Task for application scripts.
 */
gulp.task('js:app', function() {
    return gulp.src([
            config.appDir + '/modules/**/client/configs/*.js',
            config.appDir + '/modules/**/client/*.js',
            config.appDir + '/modules/**/client/directives/*.js',
            config.appDir + '/modules/**/client/services/*.js',
            config.appDir + '/modules/**/client/routes/*.js',
            config.appDir + '/modules/**/client/controllers/*.js',
            config.assetsDir + '/js/functions/*.js',
            config.assetsDir + '/js/*.js'
        ])
        .pipe(concat('app.js'))
        .pipe(minifyJs({exclude: ['tasks']}))
        .pipe(gulp.dest(config.publicDir + '/assets/js'));
});

/**
 * Watcher for application scripts.
 */
gulp.task('js:app:watch', function() {
    gulp.watch(
        config.appDir + '/modules/**/client/**/*.js', ['js:app']
    )
});

/**
 * Taks for all scripts.
 */
gulp.task('js', [
    'js:vendor',
    'js:app'
]);

/**
 * Task for vendor styles.
 */
gulp.task('css:vendor', function () {
    gulp.src([
            config.bowerDir + '/bootstrap/dist/css/bootstrap.min.css',
            config.bowerDir + '/bootstrap-select/bootstrap-select.min.css',
            config.bowerDir + '/font-awesome/css/font-awesome.min.css',
            config.assetsDir + '/css/*.css'
        ])
        .pipe(minifyCss({compatibility: 'ie8'}))
        .pipe(concat('vendor.min.css'))
        .pipe(gulp.dest(config.publicDir + '/assets/css'));
});

/**
 * Task for custom styles.
 */
gulp.task('css:app', function () {
    gulp.src([
            config.assetsDir + '/scss/styles.scss'
        ])
        .pipe(sass().on('error', sass.logError))
        .pipe(minifyCss({compatibility: 'ie8'}))
        .pipe(concat('app.min.css'))
        .pipe(gulp.dest(config.publicDir + '/assets/css'));
});

/**
 * Watcher for custom styles.
 */
gulp.task('css:app:watch', function() {
    gulp.watch(
        config.assetsDir + '/scss/**/*.scss', ['css:app']
    );
});

/**
 * Taks for all scripts.
 */
gulp.task('css', [
    'css:vendor',
    'css:app'
]);

/**
 * Task for all web fonts.
 */
gulp.task('fonts', function () {
    return gulp.src([
            config.bowerDir + '/bootstrap/dist/fonts/*.*',
            config.bowerDir + '/font-awesome/fonts/*.*',
            config.assetsDir + '/fonts/**/**/*.*'
        ])
        .pipe(plumber())
        .pipe(gulp.dest(config.publicDir + '/assets/fonts'));
});

gulp.task('default', [
    'js', 'css', 'fonts'
]);
