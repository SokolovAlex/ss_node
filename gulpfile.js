var gulp = require("gulp"),
    concat = require("gulp-concat"),
    jade = require('gulp-jade'),
    server = require("gulp-express");

var libs = [
    'node_modules/html5shiv/dist/html5shiv.js'
];

var css = [
    'node_modules/bootstrap/dist/css/bootstrap.css',
    'node_modules/font-awesome/css/css/font-awesome.css',
    'src/css/libs/**/*.css'
];

var views = [
    'src/views/**/*.html'
];

var client_src = [
    'src/js/**/*.js'
];

gulp.task("css", () => {
    return gulp.src(css)
        .pipe(concat('styles_libs.css'))
        .pipe(gulp.dest('build/css'))
});

gulp.task('lib_js', () => {
    return gulp.src(libs)
        .pipe(concat('libs.js'))
        .pipe(gulp.dest('build/js/'));
});

gulp.task('content', () => {
    return gulp.src('src/images/*')
        .pipe(gulp.dest('build/images/'));
});

gulp.task('templates', function() {
    gulp.src('./src/views/*.jade')
        .pipe(jade({
            locals: {}
        }))
        .pipe(gulp.dest('./build/views/'))
});

gulp.task("server", () => {
    return server.run(['server.js']);
});

gulp.task("default", ['templates', 'content', "css", 'lib_js', 'server']);
