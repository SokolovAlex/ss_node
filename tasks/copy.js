/**
 * Created by alexs_000 on 27.07.2016.
 */
var gulp = require('gulp');

module.exports = function() {
    // Copy Bootstrap core files from node_modules to vendor directory
    gulp.task('bootstrap', function() {
        return gulp.src(['node_modules/bootstrap/dist/**/*', '!**/npm.js', '!**/bootstrap-theme.*', '!**/*.map'])
            .pipe(gulp.dest('build/vendor/bootstrap'))
    });

    // Copy jQuery core files from node_modules to vendor directory
    gulp.task('jquery', function() {
        return gulp.src(['node_modules/jquery/dist/jquery.js', 'node_modules/jquery/dist/jquery.min.js'])
            .pipe(gulp.dest('build/vendor/jquery'))
    });

    // Copy Font Awesome core files from node_modules to vendor directory
    gulp.task('fontawesome', function() {
        return gulp.src([
                'node_modules/font-awesome/**',
                '!node_modules/font-awesome/**/*.map',
                '!node_modules/font-awesome/.npmignore',
                '!node_modules/font-awesome/*.txt',
                '!node_modules/font-awesome/*.md',
                '!node_modules/font-awesome/*.json'
            ])
            .pipe(gulp.dest('build/vendor/font-awesome'))
    });

    gulp.task('images', () => {
        return gulp.src('src/images/**/*')
            .pipe(gulp.dest('build/images/'));
    });

    // Copy all third party dependencies from node_modules to vendor directory
    gulp.task('copy', ['bootstrap', 'jquery', 'fontawesome', 'images']);

};