/*eslint-disable */
var path = require('path')
var webpack = require('webpack')
var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
  devtool: 'sourcemap',
  entry: [
    './src/main'
  ],
  output: {
    path: path.join(__dirname, 'public/assets'),
    filename: 'bundle.js',
    publicPath: '/assets/'
  },
  plugins: [
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
      __DEV__: JSON.stringify(JSON.parse(process.env.BUILD_DEV || 'true')),
      __PRERELEASE__: JSON.stringify(JSON.parse(process.env.BUILD_PRERELEASE || 'false')),
      ENV: require(path.join(__dirname, './env.js'))
    }),
    new ExtractTextPlugin("bundle.css")
  ],
  module: {
    loaders: [{
      test: /\.js$/,
      loaders: ['babel'],
      include: path.join(__dirname, 'src'),
      exclude: /node_modules/
    },
    {
      test: /\.sass$/,
      loader: ExtractTextPlugin.extract(
          'css?sourceMap!sass?sourceMap!autoprefixer!sass?indentedSyntax'
      )
    }]
  }
}
