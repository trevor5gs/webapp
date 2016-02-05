var webpack = require("webpack");
var path = require("path");
var fs = require('fs');

// load env vars first
require('dotenv').load({ silent: process.env.NODE_ENV === 'production' })

var nodeModules = {};

fs.readdirSync('node_modules')
.filter(function (x) {
  return ['.bin'].indexOf(x) === -1;
})
.forEach(function (mod) {
  nodeModules[mod] = 'commonjs ' + mod;
});

module.exports = {
  target:  "node",
  cache:   false,
  context: __dirname,
  debug:   false,
  devtool: "source-map",
  entry:   ["./server-iso"],
  output:  {
    path:          path.join(__dirname, "./dist"),
    filename:      "server-iso.js"
  },
  plugins: [
    new webpack.DefinePlugin({
      ENV: JSON.stringify(require(path.join(__dirname, './env.js')))
    })
  ],
  module:  {
    loaders: [
      {test: /\.json$/, loaders: ["json"]}
    ],
    postLoaders: [
      {test: /\.js$/, loaders: ["babel?presets[]=es2015&presets[]=stage-0&presets[]=react"], exclude: /node_modules/}
    ],
    noParse: /\.min\.js/
  },
  externals: nodeModules,
  resolve: {
    modulesDirectories: [
      "src",
      "node_modules",
      "web_modules"
    ],
    extensions: ["", ".json", ".js"]
  },
  node:    {
    __dirname: true,
    fs:        'empty'
  }
};
