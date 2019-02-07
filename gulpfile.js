var gulp = require("gulp"),
  server = require("gulp-express"),
  $ = require('gulp-load-plugins')();

require('./tasks/copy')();

require('./tasks/views')();

require('./tasks/js')();

require('./tasks/webpack')();

require('./tasks/css')();

gulp.task("server", () => {
  return server.run(['server/app.js']);
});

gulp.task("watch", (next) => {
  gulp.watch('client/css/**/*.{css,less}', ['css']);
  gulp.watch('client/js/**/*.js', ['js']);
  gulp.watch('client/js/**/*.tag', ['tags']);
  gulp.watch('server/**/*.js', ['server']);
  gulp.watch('client/**/*.jade', ['views']);
  next();
});

gulp.task('clean', function() {
  return gulp.src('./build/*', { read: false })
    .pipe($.rimraf());
});

gulp.task("default", ['views', "css", 'js', 'webpack', 'watch', 'server']);

gulp.task("all", ['copy', 'views', "css:all", 'js:all', 'watch', 'server']);

gulp.task("prod", () => {
    process.env.NODE_ENV = "prod";
    gulp.start('all');
});