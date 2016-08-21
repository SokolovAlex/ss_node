/**
 * Created by alexs_000 on 27.07.2016.
 */
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();

module.exports = function() {

    gulp.task('vendor:css', function() {
        return gulp.src(['node_modules/bootstrap/dist/css/bootstrap.css',
            'node_modules/font-awesome/css/font-awesome.css',
            'node_modules/bootstrap-datepicker/dist/css/bootstrap-datepicker3.css'])
            //.on('data', (f) => console.log(f.relative))
            .pipe(gulp.dest('client/libs/css'))
    });

    gulp.task('fonts', function() {
        return gulp.src(['node_modules/bootstrap/dist/fonts/*',
                'node_modules/font-awesome/fonts/*'])
            .pipe(gulp.dest('build/fonts/'))
    });

    // Copy Bootstrap core files from node_modules to vendor directory
    gulp.task('vendor:js', function() {
        return gulp.src(['node_modules/bootstrap/dist/js/bootstrap.js',
                'node_modules/bootstrap-datepicker/js/bootstrap-datepicker.js'])
            .pipe(gulp.dest('client/libs/js'))
    });

    // Copy jQuery core files from node_modules to vendor directory
    gulp.task('jquery', function() {
        return gulp.src(['node_modules/jquery/dist/jquery.js', 'node_modules/jquery.easing/jquery.easing.js'])
            .pipe(gulp.dest('client/libs/js'))
    });

    // Copy jQuery core files from node_modules to vendor directory
    gulp.task('lodash', function() {
        return gulp.src(['node_modules/lodash/lodash.js'])
            .pipe(gulp.dest('client/libs/js'))
    });

    gulp.task('images', () => {
        return gulp.src('client/images/**/*')
            .pipe(gulp.dest('build/images/'));
    });

    gulp.task('couples', () => {
        return gulp.src('submodules/couples/src/build/**/*')
            .on('data', (f) => console.log(f.relative))
            .pipe(gulp.dest('client/games/couples'));
    });

    gulp.task('games', ['couples']);

    // Copy all third party dependencies from node_modules to vendor directory
    gulp.task('copy', ['vendor:css', 'fonts', 'vendor:js', 'jquery', 'lodash', 'images']);

};