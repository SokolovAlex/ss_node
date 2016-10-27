var concat = require('gulp-concat');

gulp.task('vendorcss', function () {

    return gulp.src(config['vendorcss']['src'])

        .pipe(concat(config['vendorcss']['dst']))
        .on('error', onErrors)


        .pipe(gulp.dest(config['public']));
});