var webpack = require('webpack');
var config = require("./prod.config.js");
var ExtractTextPlugin = require('extract-text-webpack-plugin')
config.devtool = "eval";

config.entry.push('webpack-dev-server/client?http://0.0.0.0:8080');
config.entry.push('webpack/hot/only-dev-server');
config.plugins = []
config.plugins.push(new webpack.HotModuleReplacementPlugin())
config.plugins.push(new webpack.NoErrorsPlugin())

config.module.loaders[0].loader = 'react-hot!babel';
config.module.loaders[2].loader = 'style!css!autoprefixer!sass?indentedSyntax';

module.exports = config;

