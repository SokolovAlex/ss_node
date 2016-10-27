gulp.task('img', function () {
    return gulp.src(config['img']['src'])
        .pipe(gulp.dest(config['public'] + config['img']['dst']))
});