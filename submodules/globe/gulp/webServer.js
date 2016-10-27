var webServer = require('gulp-webserver');

gulp.task('webServer', function () {
    gulp.src(config['public'])
        .pipe(webServer(config['webServer']['server']));
});