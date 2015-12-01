/* eslint-disable */
var path = require('path')
var webpack = require('webpack')
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin')
var jade = require('jade')

// load env vars first
require('dotenv').load({ silent: process.env.NODE_ENV === 'production' })

module.exports = {
  entry: {
    main: './src/main',
  },
  output: {
    path: path.join(__dirname, 'public/static'),
    filename: '[name].entry.js',
    chunkFilename: '[id].chunk.js',
    hash: true,
    publicPath: '/static/',
  },
  plugins: [
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
      ENV: JSON.stringify(require(path.join(__dirname, './env.js')))
    }),
    new ExtractTextPlugin('bundle.css'),
    new webpack.optimize.CommonsChunkPlugin('commons'),
    new HtmlWebpackPlugin({
      filename: '../index.html',
      chunks: ['commons', 'main'],
      templateContent: jade.renderFile('public/template.jade', { pretty: true }),
      hash:true,
      inject: 'body',
    }),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin(),
    new webpack.optimize.OccurenceOrderPlugin(true)
  ],
  module: {
    loaders: [{
      test: /\.js$/,
      loader: 'babel',
      include: path.join(__dirname, 'src'),
      exclude: /node_modules/,
      query: {
        presets: ['es2015', 'react', 'stage-0'],
      },
    },
    {
      test: /\.sass$/,
      loader: ExtractTextPlugin.extract(
          'css!sass!autoprefixer!sass?indentedSyntax'
      )
    }]
  }
}
