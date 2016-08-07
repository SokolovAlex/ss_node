var gulp = require("gulp"),
    browser_sync = require('browser-sync').create(),
    server = require("gulp-express");

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
    gulp.watch('src/**/*.html', ['views']);
    next();
});

gulp.task("browser-sync", (next) => {
    browser_sync.init({
        proxy: 'localhost:3000'
    });
    browser_sync.watch('build/**/*.*').on('change', browser_sync.reload);
});

gulp.task("default", ['views', "css", 'js', 'watch', 'server']);
