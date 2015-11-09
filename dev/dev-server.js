/* eslint-disable */
var path = require('path')
var express = require('express')
var webpack = require('webpack')
var config = require('../webpack.dev.config')
var app = express()
var compiler = webpack(config)

// Development Middleware
app.use(require('webpack-dev-middleware')(compiler, {
  noInfo: true,
  publicPath: config.output.publicPath
}))
app.use(require('webpack-hot-middleware')(compiler))

// Assets
app.use(express.static('public'))
app.use('/static', express.static('public/static'))

// Main entry for app
app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname, 'dev.html'))
})


// Catchall for any requests like /onboarding
app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, 'dev.html'))
})

app.listen(6660, 'localhost', function(err) {
  if (err) {
    console.log(err)
    return
  }
  console.log('Listening at http://localhost:6660')
})
