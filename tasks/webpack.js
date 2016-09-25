/**
 * Created by alexs_000 on 27.07.2016.
 */
var gulp = require('gulp');
var named = require('vinyl-named');
var webpackStream = require('webpack-stream');
var webpack = webpackStream.webpack;

module.exports = function() {
    gulp.task('webpack', function() {
        return gulp.src('client/js/pages_wp/*.js')
            .pipe(named())
            .pipe(webpackStream({
                watch: true,
                output: {
                    publicPath: '',
                    library: 'app'
                },
                plugins: [
                    new webpack.ProvidePlugin({
                        riot: 'riot'
                    })
                ],
                module: {
                    preLoaders: [
                        {test: /\.tag$/, exclude: /node_modules/, loader: 'riotjs-loader', query: {type: 'none'}}
                    ]
                }
            }))
            .pipe(gulp.dest('build/js/pages'));
    });
};