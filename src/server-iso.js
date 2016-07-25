/* eslint-disable max-len, no-console */
import 'newrelic'
import 'babel-polyfill'
import 'isomorphic-fetch'
import { values } from 'lodash'

function handleZlibError(error) {
  if (error.code === 'Z_BUF_ERROR') {
    console.error(error)
  } else {
    console.log(error.stack)
    throw error
  }
}
process.on('uncaughtException', handleZlibError)

import Honeybadger from 'honeybadger'
import express from 'express'
import morgan from 'morgan'
import librato from 'librato-node'
import path from 'path'
import fs from 'fs'
import cp from 'child_process'
import { updateStrings as updateTimeAgoStrings } from './vendor/time_ago_in_words'
import { addOauthRoute, currentToken } from '../oauth'

// load env vars first
require('dotenv').load({ silent: process.env.NODE_ENV === 'production' })
global.ENV = require('../env')
updateTimeAgoStrings({ about: '' })

const app = express()
const preRenderTimeout = (parseInt(process.env.PRERENDER_TIMEOUT, 10) || 15) * 1000

// Honeybadger "before everything" middleware
app.use(Honeybadger.requestHandler);

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

const indexStr = fs.readFileSync(path.join(__dirname, '../public/index.html'), 'utf-8')

// Wire up OAuth route
addOauthRoute(app)

// Assets
app.use(express.static('public', { maxAge: '1y', index: false }))
app.use('/static', express.static('public/static', { maxAge: '1y' }))

function renderFromServer(req, res) {
  currentToken().then((token) => {
    const child = cp.fork('./dist/server-render-entrypoint')
    // Don't let processes run away on us
    const renderTimeout = setTimeout(() => {
      console.log('Render timed out; killing child process and returning boilerplate.')
      librato.increment('webapp-server-render-timeout')
      child.kill('SIGKILL')
      res.send(indexStr)
    }, preRenderTimeout)
    // Handle the return on renders
    child.once('message', (msg) => {
      const { type, location, body } = msg
      switch (type) {
        case 'redirect':
          console.log(`Redirecting to ${location}`)
          librato.increment('webapp-server-render-redirect')
          res.redirect(location)
          break
        case 'render':
          console.log('Rendering ISO response')
          librato.increment('webapp-server-render-success')
          res.send(body)
          break
        case 'error':
          console.log('Rendering error response')
          librato.increment('webapp-server-render-error')
          res.status(500).end()
          break
        default:
          // No-op
      }
      clearTimeout(renderTimeout)
    })
    // Clean up any lingering renderer processes at shutdown
    const exitHandler = () => {
      console.log(`Killing child render process ${child.pid}`)
      child.kill('SIGKILL')
    }
    process.on('exit', exitHandler);

    // Handle assorted child process errors
    child.once('exit', (code, signal) => {
      console.log(`Render process exited with ${code} due to ${signal}`)
      res.status(500).end()
      clearTimeout(renderTimeout)
      process.removeListener('exit', exitHandler);
    })
    // Kick off the render
    child.send({ access_token: token.token.access_token, originalUrl: req.originalUrl, url: req.url })
  })
}

const noPreRenderPaths = {
  following: /^\/following/,
  forgotPassword: /^\/forgot-password/,
  enter: /^\/enter/,
  invitations: /^\/invitations/,
  join: /^\/join/,
  settings: /^\/settings/,
  signup: /^\/signup/,
  starred: /^\/starred/,
  notifications: /^\/notifications/,
}

export function canPrerenderRequest(req) {
  if (req.get('X-Skip-Prerender') === 'true') {
    return false
  }
  return values(noPreRenderPaths).every((regex) =>
    !req.url.match(regex)
  )
}

app.use((req, res) => {
  res.setHeader('Cache-Control', 'public, max-age=60');
  res.setHeader('Expires', new Date(Date.now() + 1000 * 60).toUTCString());
  if (canPrerenderRequest(req)) {
    console.log('Serving pre-rendered markup for path', req.url)
    renderFromServer(req, res)
  } else {
    console.log('Serving static markup for path', req.url)
    res.send(indexStr)
  }
})

// Honeybadger "after everything" middleware
app.use(Honeybadger.errorHandler);

export default app

