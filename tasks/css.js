/**
 * Created by alexs_000 on 27.07.2016.
 */
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var browserSync = require('browser-sync').create();

module.exports = function() {

    var isProd = process.env.NODE_ENV === "prod";

    gulp.task('css', function() {
        return gulp.src(['src/css/theme.css', 'src/css/*.less'])
            .pipe($.sourcemaps.init())
            .pipe($.concat('styles.css'))
            .pipe($.less())
            .pipe($.sourcemaps.write())
            .pipe(gulp.dest('build/css'))
            .pipe(browserSync.reload({
                stream: true
            }));
    });
};




