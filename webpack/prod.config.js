var path = require('path')
var output = path.join(__dirname, '../assets')
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
    publicPath: '/assets/'
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

