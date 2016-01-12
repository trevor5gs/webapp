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
import React from 'react'
import { renderToString } from 'react-dom/server'
import { match, RouterContext } from 'react-router'
import { Provider } from 'react-redux'
import store from './src/store'
import { updateStrings as updateTimeAgoStrings } from './src/vendor/time_ago_in_words'
import addOauthRoute from './oauth'
import routes from './src/routes'
import { replacePath } from 'redux-simple-router'

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

// Return promises for initial loads
function preRender(renderProps) {
  const promises = renderProps.components.map(component => (component && component.preRender) ? component.preRender(store, renderProps) : null).filter(component => !!component)
  return Promise.all(promises)
}

function renderFromServer(req, res) {
  match({ routes, location: req.url }, (error, redirectLocation, renderProps) => {
    // populate the rouer store object for initial render
    store.dispatch(replacePath(renderProps.location.pathname, {}, { avoidRouterUpdate: true }))
    if (error) {
      console.log('ELLO MATCH ERROR', error)
    } else if (redirectLocation) {
      console.log('ELLO HANDLE REDIRECT', redirectLocation)
    } else if (!renderProps) { return }
    preRender(renderProps).then(() => {
      const InitialComponent = (
        <Provider store={store}>
          <RouterContext {...renderProps} />
        </Provider>
      )
      const componentHTML = renderToString(InitialComponent)
      const state = store.getState()
      const initialStateTag = `<script id="initial-state">window.__INITIAL_STATE__ = ${JSON.stringify(state)}</script>`
      indexStr = indexStr.replace('<div id="root"></div>', `<div id="root">${componentHTML}</div>${initialStateTag}`)
      res.send(indexStr)
    }).catch((err) => {
      // this will give you a js error like:
      // `window is not defined`
      console.log('ELLO CATCH ERROR', err)
    })
  })
}

const loggedOutPaths = {
  find: /^\/find$/,
  explore: /^\/explore/,
  explore_recent: /^\/explore\/recent/,
  explore_trending: /^\/explore\/trending/,
  signup: /^\/signup/,
}

app.use((req, res) => {
  let isLoggedOutPath = false
  for (const re in loggedOutPaths) {
    if (req.url.match(loggedOutPaths[re])) {
      isLoggedOutPath = true
      break
    }
  }
  console.log('ELLO START URL', req.url, isLoggedOutPath)
  if (isLoggedOutPath) {
    renderFromServer(req, res)
  } else {
    res.send(indexStr)
  }
})

const port = process.env.PORT || 6660
const WORKERS = process.env.WEB_CONCURRENCY || 1;
const start = () => {
  app.listen(port, (err) => {
    if (err) {
      console.log(err)
      return
    }
    console.log('Listening at http://localhost:' + port)
  })
}

throng(start, {
  workers: WORKERS,
  lifetime: Infinity,
});
