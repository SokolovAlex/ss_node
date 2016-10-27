gulp.task('fonts', function () {
    return gulp.src(config['fonts']['src'])
        .pipe(gulp.dest(config['public'] + config['fonts']['dst']))
});