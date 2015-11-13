/* eslint-disable */
var path = require('path')
var webpack = require('webpack')
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  devtool: 'sourcemap',
  entry: {
    main: [ './src/main', 'webpack-hot-middleware/client' ]
  },
  output: {
    path: path.join(__dirname, 'public/static'),
    filename: '[name].entry.js',
    publicPath: '/static/'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
      __DEV__: JSON.stringify(JSON.parse(process.env.BUILD_DEV || 'true')),
      __PRERELEASE__: JSON.stringify(JSON.parse(process.env.BUILD_PRERELEASE || 'false')),
      ENV: require(path.join(__dirname, './env.js'))
    })
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
      loader: 'style!css!autoprefixer!sass?indentedSyntax'
    }]
  }
}
