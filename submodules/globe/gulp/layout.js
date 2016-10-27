var jade = require('gulp-jade'),
    gIf = require('gulp-if'),
    minify = require('gulp-minify-html'),
    data = require('gulp-data'),
    concat = require('gulp-concat');

gulp.task('layout', function () {

    return gulp.src(config['layout']['src'])

        .pipe(data(function(file) {
            return require('../package.json');
        }))

        .pipe(jade({ pretty: true }))
        .on('error', onErrors)

        .pipe(gIf(config.isProduction, minify()))
        .on('error', onErrors)


        .pipe(concat(config['layout']['dst']))
        .on('error', onErrors)

        .pipe(gulp.dest(config['public']));
});