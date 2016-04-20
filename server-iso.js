/* eslint-disable max-len */
import 'newrelic'
import 'babel-polyfill'
import 'isomorphic-fetch'

function handleZlibError(error) {
  if (error.code === 'Z_BUF_ERROR') {
    console.error(error)
  } else {
    console.log(error.stack)
    throw error
  }
}
process.on('uncaughtException', handleZlibError)

import express from 'express'
import morgan from 'morgan'
import throng from 'throng'
import librato from 'librato-node'
import path from 'path'
import fs from 'fs'
import React from 'react'
import Helmet from 'react-helmet'
import { renderToString } from 'react-dom/server'
import { createMemoryHistory, match, RouterContext } from 'react-router'
import { Provider } from 'react-redux'
import { createElloStore } from './src/store'
import { updateStrings as updateTimeAgoStrings } from './src/vendor/time_ago_in_words'
import { addOauthRoute, fetchOauthToken } from './oauth'
import createRoutes from './src/routes'
import { replace, syncHistoryWithStore } from 'react-router-redux'

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
app.use(express.static('public', { maxAge: '1y', index: false }))
app.use('/static', express.static('public/static', { maxAge: '1y' }))

// Return promises for initial loads
function preRender(renderProps, store) {
  const promises = renderProps.components.map(component => (component && component.preRender) ? component.preRender(store, renderProps) : null).filter(component => !!component)
  return Promise.all(promises)
}

function renderFromServer(req, res) {
  const memoryHistory = createMemoryHistory(req.originalUrl)
  const store = createElloStore(memoryHistory)
  const routes = createRoutes(store)
  const history = syncHistoryWithStore(memoryHistory, store)

  match({ history, routes, location: req.url }, (error, redirectLocation, renderProps) => {
    // populate the router store object for initial render
    if (error) {
      console.log('ELLO MATCH ERROR', error)
    } else if (redirectLocation) {
      console.log('ELLO HANDLE REDIRECT', redirectLocation)
      res.redirect(redirectLocation.pathname)
      return
    } else if (!renderProps) {
      console.log('NO RENDER PROPS')
      return
    }

    store.dispatch(replace(renderProps.location.pathname))

    preRender(renderProps, store).then(() => {
      const InitialComponent = (
        <Provider store={store}>
          <RouterContext {...renderProps} />
        </Provider>
      )
      const componentHTML = renderToString(InitialComponent)
      const head = Helmet.rewind()
      const state = store.getState()
      const initialStateTag = `<script id="initial-state">window.__INITIAL_STATE__ = ${JSON.stringify(state)}</script>`
      // Add helmet's stuff after the last statically rendered meta tag
      const html = indexStr.replace(
        'content="ie=edge">',
        `content="ie=edge">${head.title.toString()} ${head.meta.toString()} ${head.link.toString()}`
      ).replace('<div id="root"></div>', `<div id="root">${componentHTML}</div>${initialStateTag}`)
      res.send(html)
    }).catch((err) => {
      // this will give you a js error like:
      // `window is not defined`
      console.log('ELLO CATCH ERROR', err)
      res.status(500).end()
    })
  })
}

const loggedInPaths = {
  following: /^\/following/,
  invitations: /^\/invitations/,
  settings: /^\/settings/,
  starred: /^\/starred/,
  notifications: /^\/notifications/,
}

if (process.env['ENABLE_ISOMORPHIC_RENDERING']) {
  console.log('Isomorphic rendering enabled, serving prerendered pages')
  app.use((req, res) => {
    let isLoggedInPath = false
    for (const re in loggedInPaths) {
      if (req.url.match(loggedInPaths[re])) {
        isLoggedInPath = true
        break
      }
    }
    res.setHeader('Cache-Control', 'public, max-age=60');
    res.setHeader('Expires', new Date(Date.now() + 1000 * 60).toUTCString());
    if (isLoggedInPath) {
      console.log('Serving static markup for logged-in path', req.url)
      res.send(indexStr)
    } else {
      console.log('Serving prerendered markup for logged-out path', req.url)
      renderFromServer(req, res)
    }
  })
} else {
  console.log('Isomorphic rendering disabled, serving static HTML')
  app.use((req, res) => {
    res.send(indexStr)
  })
}

const port = process.env.PORT || 6660
const workers = process.env.WEB_CONCURRENCY || 1;
const backlog = process.env.BACKLOG || 511

const start = (workerId) => {
  const server = app.listen(port, backlog, (err) => {
    if (err) {
      console.log(err)
      return
    }
    console.log('Worker ' + workerId + ' listening at http://localhost:' + port)
  })

  process.on('SIGINT', () => {
    console.log('Caught SIGINT, exiting...')
    setTimeout(() => {
      console.log('Server did not drain connections within 5 seconds. Forcing shutdown...')
      process.exit(0)
    }, 5000)
    server.close(() => {
      process.exit(0)
    })
  })
}

// Kick off token fetch
fetchOauthToken(() => {
  start(1)
})
