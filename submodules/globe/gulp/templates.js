var jade = require('gulp-jade'),
    gIf = require('gulp-if'),
    minify = require('gulp-minify-html'),
    templatecache = require('gulp-angular-templatecache'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat');

gulp.task('templates', function () {

    return gulp.src(config['templates']['src'])

        .pipe(jade())
        .on('error', onErrors)

        .pipe(gIf(config.isProduction, minify()))
        .on('error', onErrors)

        .pipe(templatecache(config['templates']['params']))
        .on('error', onErrors)

        .pipe(gIf(config.isProduction, uglify()))
        .on('error', onErrors)


        .pipe(gulp.dest(config['public']+ config['templates']['dst']));
});
