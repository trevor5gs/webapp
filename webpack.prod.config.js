/* eslint-disable */
var path = require('path')
var webpack = require('webpack')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var HtmlWebpackPlugin = require('html-webpack-plugin')

// load env vars first
require('dotenv').load({ silent: process.env.NODE_ENV === 'production' })

const nodeEnv = process.env.NODE_ENV || 'development'

module.exports = {
  entry: {
    main: './src/main',
  },
  output: {
    path: path.join(__dirname, 'public/static'),
    filename: '[name].entry.js',
    chunkFilename: '[id].chunk.js',
    hash: true,
    publicPath: (process.env.CDN || '') + '/static/',
  },
  plugins: [
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
      ENV: JSON.stringify(require(path.join(__dirname, './env.js'))),
      'process.env': { NODE_ENV: JSON.stringify(nodeEnv) },
    }),
    new ExtractTextPlugin('bundle.css'),
    new HtmlWebpackPlugin({
      filename: '../index.html',
      chunks: ['main'],
      hash:true,
      template: 'public/template.html',
      inject: 'body',
    }),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),
    new webpack.optimize.OccurenceOrderPlugin(true)
  ],
  module: {
    loaders: [{
      test: /\.js$/,
      loader: 'babel',
      include: path.join(__dirname, 'src'),
      exclude: /node_modules/,
    },
    {
      test: /\.sass$/,
      loader: ExtractTextPlugin.extract(
          'css!autoprefixer!sass?indentedSyntax'
      )
    }]
  }
}
