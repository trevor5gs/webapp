var path = require('path')
var webpack = require('webpack')
var output = path.join(__dirname, '../build')
var ExtractTextPlugin = require('extract-text-webpack-plugin')

module.exports = {
  context: path.resolve(__dirname, '..'),
  resolve: {
    extensions: ['', '.js']
  },
  entry: [
    './src/main.js'
  ],
  output: {
    path: output,
    filename: 'bundle.js',
    publicPath: '/build/'
  },
  progress: true,
  module: {
    loaders: [
      {
        test: /\.js.*$/,
        loader: 'babel',
        exclude: /node_modules/
      },
      {
        test: /\.png.*$/,
        loaders: ['url-loader?limit=100000&mimetype=image/png'],
        exclude: /node_modules/
      },
      {
        test: /\.sass$/,
        // Passing indentedSyntax query param to node-sass
        loader: ExtractTextPlugin.extract('style', 'css!autoprefixer!sass?indentedSyntax')
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin('bundle.css')
  ]
};

