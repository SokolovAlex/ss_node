/**
 * Created by alexs_000 on 27.07.2016.
 */
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();

var client_js = [
    'client/js/**/*.js'
];

module.exports = function() {

    var isProd = process.env.NODE_ENV === "prod";

    gulp.task('js', () => {
        return gulp.src(client_js)
            .pipe($.sourcemaps.init())
            .pipe($.if(isProd, $.uglify()))
            .pipe($.concat('bundle.js'))
            .pipe($.sourcemaps.write())
            .pipe(gulp.dest('build/js/'));
    });

};