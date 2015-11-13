const path = require('path')
const express = require('express')
const webpack = require('webpack')
const config = require('../webpack.dev.config')
const app = express()
const compiler = webpack(config)

// Development Middleware
app.use(require('webpack-dev-middleware')(compiler, {
  noInfo: true,
  publicPath: config.output.publicPath,
}))
app.use(require('webpack-hot-middleware')(compiler))

// Assets
app.use(express.static('public'))
app.use('/static', express.static('public/static'))

// Main entry for app
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dev.html'))
})


// Catchall for any requests like /onboarding
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dev.html'))
})

app.listen(6660, 'localhost', (err) => {
  if (err) {
    console.log(err)
    return
  }
  console.log('Listening at http://localhost:6660')
})
