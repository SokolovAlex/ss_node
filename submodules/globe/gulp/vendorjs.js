var concat = require('gulp-concat');

gulp.task('vendorjs', function () {
    return gulp.src(config['vendorjs']['src'])
        //.on('data', f => console.log(f))
        .pipe(concat(config['vendorjs']['dst']))
        .on('error', onErrors)
        .pipe(gulp.dest(config['public']));
});