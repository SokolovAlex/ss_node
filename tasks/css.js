/**
 * Created by alexs_000 on 27.07.2016.
 */
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();

module.exports = function() {

    var isProd = process.env.NODE_ENV === "prod";

    gulp.task('css', function() {
        return gulp.src(['client/css/theme.css', 'client/css/**/*.less'])
            .pipe($.sourcemaps.init())
            .pipe($.concat('styles.css'))
            .pipe($.less())
            .pipe($.sourcemaps.write())
            .pipe(gulp.dest('build/css'));
    });
};




