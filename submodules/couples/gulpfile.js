var gulp = require("gulp"),
    browserify = require("browserify"),
    rimraf = require("rimraf"),
    concat = require("gulp-concat"),
    source = require('vinyl-source-stream'),
    webserver = require('gulp-webserver'),
    babelify = require('babelify');

var watch_src = ['src/js/*.jsx', 'src/js/*.js', 'src/css/*.css'];

gulp.task('clean', () => {
    return rimraf("src/build/**/*.*", { nosort: true, silent: true }, function(){});
});

gulp.task('js', () => {
    return browserify('src/js/app.jsx')
        .transform(babelify, {
            presets: [require('babel-preset-stage-2'), require('babel-preset-es2015'), 'react'],
            plugins: [require('babel-plugin-transform-runtime')]
        })
        .bundle()
        .pipe(source('app.jsx'))
        .pipe(gulp.dest('src/build'));
});

gulp.task("watch", () => {
    gulp.watch(watch_src, ['js', 'css']);
});

gulp.task("css", () => {
    return gulp.src('src/css/*.css')
        .pipe(concat('styles.css'))
        .pipe(gulp.dest('src/build/'))
});

gulp.task('webserver', () =>{
    return gulp.src('./')
        .pipe(webserver({
            livereload: true,
            port: 2222,
            directoryListing: true,
            open: true
        }));
});

gulp.task('copy', () =>{
    return gulp.src('src/images/**/*')
        .pipe(gulp.dest('src/build/images'));
});

gulp.task("build", ['clean', 'copy', 'js', 'css', 'watch']);

gulp.task("default", ['build', 'webserver']);