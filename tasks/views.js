/**
 * Created by alexs_000 on 27.07.2016.
 */
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();

module.exports = function() {

    var isProd = process.env.NODE_ENV === "prod";

    gulp.task('views', function() {
        return gulp.src('src/views/*.html')
            .pipe(gulp.dest('build/views'))
    });

    gulp.task('jade', function() {
        return gulp.src('src/views/welcome.jade')
            .pipe($.jade({pretty: true}))
            .pipe(gulp.dest('build/views'))
    });
};