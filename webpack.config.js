// статистика - analyze --> webpack --json --profile > stats.json --> webpack.github.io/analyze
// мультикомпиляция - module.exports = [{lqng: ru}, {}, {}];
// dynamic require - require.ensure([], () => {let login = require('./login'); }, 'auth+++')

var path = require('path');

var node_env = process.env.NODE_ENV || 'dev',
    webpack = require('webpack');

node_env = 'prod';

module.exports = {
    context: __dirname + '/src/js',
    entry: {
        app: './app',
        about: './about',
        common: './common'
    },
    output: {
        filename: '[name].js',
        path: __dirname + '/build',
        publicPath: '/',
        library: '[name]'
    },

    watch: node_env === 'dev',

    devtool: "cheap-inline-module-source-map",//source-map//eval

    plugins: [
        new webpack.NoErrorsPlugin(),
        new webpack.DefinePlugin({
            NODE_ENV: JSON.stringify(node_env)
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: "common",
            minChunk: 2
        })
    ],

    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: "babel-loader",
                query: {
                    plugins: ['transform-runtime'],
                    presets: ['es2015']
                }
            }
        ]
    },
    resolve: {
        modulesDirectories: ['node_modules'],
        extensions: ['', '.js']
    },

    resolveLoaders: {
        modulesDirectories: ['node_modules'],
        moduleTemplates: ['*', '*-loader'],
        extensions: ['', '.js']
    }
};

if (node_env === 'prod') {
    module.exports.plugins.push(
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                // don't show unreachable variables etc
                warnings: false,
                drop_console: true,
                unsafe: true
            }
        })
    );
}




