import path from 'path'
import express from 'express'
import webpack from 'webpack'
import config from './webpack.dev.config'
import { addOauthRoute, fetchOauthToken } from './oauth'
import { updateStrings as updateTimeAgoStrings } from './src/vendor/time_ago_in_words'

const app = express()
const compiler = webpack(config)

updateTimeAgoStrings({ about: '' })
addOauthRoute(app)

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
  res.sendFile(path.join(__dirname, './public/dev.html'))
})


// Catchall for any requests like /onboarding
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, './public/dev.html'))
})

fetchOauthToken(() => {
  app.listen(6660, '0.0.0.0', (err) => {
    if (err) {
      console.log(err)
      return
    }
    console.log('Listening at http://localhost:6660')
  })
})
