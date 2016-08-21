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

    gulp.task('libs', () => {
        return gulp.src([
                'client/libs/js/jquery.js',
                'client/libs/js/jquery.easing.js',
                'client/libs/js/lodash.js',
                'client/libs/js/bootstrap.js',
                'client/libs/js/bootstrap-datepicker.js'
            ])
            .pipe($.sourcemaps.init())
            .pipe($.if(isProd, $.uglify()))
            //.on('data', f => console.log('libs --> ', f.relative))
            .pipe($.concat('libs.js'))
            .pipe($.sourcemaps.write())
            .pipe(gulp.dest('build/js/'));
    });

    gulp.task('scripts', () => {
        return gulp.src(client_js)
            .pipe($.sourcemaps.init())
            .pipe($.if(isProd, $.uglify()))
            .pipe($.concat('bundle.js'))
            .pipe($.sourcemaps.write())
            .pipe(gulp.dest('build/js/'));
    });

    gulp.task('js', ['libs', 'scripts']);

};