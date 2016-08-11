var gulp = require("gulp"),
    server = require("gulp-express"),
    $ = require('gulp-load-plugins')();

require('./tasks/copy')();

require('./tasks/views')();

require('./tasks/js')();

require('./tasks/css')();

gulp.task("server", () => {
    return server.run(['server.js']);
});

gulp.task("watch", (next) => {
    gulp.watch('src/css/**/*.{css,less}', ['css']);
    gulp.watch('src/js/**/*.js', ['js']);
    gulp.watch('src/**/*.jade', ['views']);
    next();
});

gulp.task('clean', function() {
    return gulp.src('./build/*', { read: false }) // much faster
        .pipe($.rimraf());
});

gulp.task("default", ['copy', 'views', "css", 'js', 'watch', 'server']);
