var stylus = require('gulp-stylus'),
    gIf = require('gulp-if'),
    minify = require('gulp-minify-css'),
    autoprefixer = require('gulp-autoprefixer'),
    concat = require('gulp-concat');

gulp.task('stylus', function () {

    return gulp.src(config['stylus']['src'])

        .pipe(stylus())
        .on('error', onErrors)

        .pipe(autoprefixer({
            browsers: [ 'ie >= 10',
                'ie_mob >= 10',
                'ff >= 29',
                'chrome >= 34',
                'safari >= 6',
                'opera >= 23',
                'ios >= 7',
                'android >= 4.4',
                'bb >= 10'],
            cascade: true
        }))

        .pipe(gIf(config.isProduction, minify()))
        .on('error', onErrors)

        .pipe(concat(config['stylus']['dst']))
        .on('error', onErrors)

        .pipe(gulp.dest(config['public']));
});