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
import React from 'react'
import Helmet from 'react-helmet'
import { renderToString } from 'react-dom/server'
import { createMemoryHistory, match, RouterContext } from 'react-router'
import { Provider } from 'react-redux'
import { createElloStore } from './store'
import { updateStrings as updateTimeAgoStrings } from './vendor/time_ago_in_words'
import { addOauthRoute, currentToken } from '../oauth'
import createRoutes from './routes'
import { replace, syncHistoryWithStore } from 'react-router-redux'
import { serverRoot } from './sagas'

// load env vars first
require('dotenv').load({ silent: process.env.NODE_ENV === 'production' })
global.ENV = require('../env')
updateTimeAgoStrings({ about: '' })

const app = express()
const preRenderTimeout = (parseInt(process.env.PRERENDER_TIMEOUT, 0) || 15) * 1000

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

// Return promises for initial loads
function preRender(renderProps, store) {
  const sagaTask = store.runSaga(serverRoot)
  const promises = renderProps.components.map(component => ((component && component.preRender) ? component.preRender(store, renderProps) : null)).filter(component => !!component)

  promises.push(sagaTask.done)
  return Promise.all(promises)
}

function renderFromServer(req, res) {
  currentToken().then((token) => {
    const memoryHistory = createMemoryHistory(req.originalUrl)
    const store = createElloStore(memoryHistory, {
      authentication: {
        accessToken: token.token.access_token,
        isLoggedIn: false,
      },
    })
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

      const InitialComponent = (
        <Provider store={store}>
          <RouterContext {...renderProps} />
        </Provider>
      )

      preRender(renderProps, store).then(() => {
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
        Honeybadger.notify(err);
        res.status(500).end()
      })
      renderToString(InitialComponent)
      store.close()
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

export function canPrerenderRequest(req) {
  if (req.get('X-Skip-Prerender') === 'true') {
    return false
  }
  return values(loggedInPaths).every((regex) =>
    !req.url.match(regex)
  )
}

app.use((req, res) => {
  res.setHeader('Cache-Control', 'public, max-age=60');
  res.setHeader('Expires', new Date(Date.now() + 1000 * 60).toUTCString());
  if (canPrerenderRequest(req)) {
    console.log('Serving pre-rendered markup for path', req.url)
    const timeout = setTimeout(() => {
      console.log(`Prerendering timed out after ${preRenderTimeout}ms. Serving static content instead.`)
      res.send(indexStr)
    }, preRenderTimeout)
    renderFromServer(req, res)
    clearTimeout(timeout)
  } else {
    console.log('Serving static markup for path', req.url)
    res.send(indexStr)
  }
})

// Honeybadger "after everything" middleware
app.use(Honeybadger.errorHandler);

export default app

