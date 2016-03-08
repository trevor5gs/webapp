/* eslint-disable max-len */
import 'newrelic'
import 'babel-polyfill'
import 'isomorphic-fetch'

import express from 'express'
import morgan from 'morgan'
import throng from 'throng'
import librato from 'librato-node'
import path from 'path'
import fs from 'fs'
import { updateStrings as updateTimeAgoStrings } from './src/vendor/time_ago_in_words'
import addOauthRoute from './oauth'

// load env vars first
require('dotenv').load({ silent: process.env.NODE_ENV === 'production' })
global.ENV = require('./env')
updateTimeAgoStrings({ about: '' })

const app = express()

// Log requests with Morgan
app.use(morgan('combined'))

// Send stats to Librato
librato.configure({ email: process.env.LIBRATO_EMAIL,
                    token: process.env.LIBRATO_TOKEN })
librato.start()
app.use(librato.middleware())

librato.on('error', (err) => {
  console.log('ELLO LIBRATO ERROR', err)
})

let indexStr = ''
// grab out the index.html string first thing
fs.readFile(path.join(__dirname, './public/index.html'), 'utf-8', (err, data) => {
  if (!err) {
    indexStr = data
  }
})

// Wire up OAuth route
addOauthRoute(app)

// Assets
app.use(express.static('public'))
app.use('/static', express.static('public/static'))

app.use((req, res) => {
  console.log('ELLO START URL', req.url)
  res.send(indexStr)
})

const port = process.env.PORT || 6660
const workers = process.env.WEB_CONCURRENCY || 1;
const start = (workerId) => {
  app.listen(port, (err) => {
    if (err) {
      console.log(err)
      return
    }
    console.log(`Worker ${workerId} listening at http://localhost:${port}`)
  })
}

if (workers > 1) {
  throng(start, {
    workers,
    lifetime: Infinity,
  })
} else {
  start(1)
}
