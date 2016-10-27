gulp.task('data', function () {
    return gulp.src(config['data']['src'])
        .pipe(gulp.dest(config['public'] + config['data']['dst']))
});
