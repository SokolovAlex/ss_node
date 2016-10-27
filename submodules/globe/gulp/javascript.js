var gIf = require('gulp-if'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    stylish = require('jshint-stylish'),
    concat = require('gulp-concat'),
    ngAnnotate = require('gulp-ng-annotate'),
    replace = require('gulp-replace');

gulp.task('javascript', function () {

    return gulp.src(config['javascript']['src'])


       // .pipe(jshint())
       // .pipe(jshint.reporter(stylish))
        .pipe(ngAnnotate())

        .pipe(concat(config['javascript']['dst']))
        .on('error', onErrors)


        .pipe(replace('{{SERVER}}', options.server))
        .pipe(replace('{{PROTOCOL}}', options.protocol))
        .pipe(gIf(config.isProduction, uglify()))
        .on('error', onErrors)

        .pipe(gulp.dest(config['public']));
});
