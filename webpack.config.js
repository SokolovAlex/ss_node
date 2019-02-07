var node_env = process.env.NODE_ENV || 'dev',
  webpack = require('webpack');

node_env = 'prod';

module.exports = {
    context: __dirname + '/client/js',
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
          include: './client/',
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
        warnings: false,
        drop_console: true,
        unsafe: true
      }
    })
  );
}




