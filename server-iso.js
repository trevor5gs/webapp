// load env vars first
import dotenv from 'dotenv'
dotenv.load()

import 'newrelic'
import 'babel-core/polyfill'
import 'isomorphic-fetch'

import express from 'express'
import path from 'path'
import fs from 'fs'
import React from 'react'
import { renderToString } from 'react-dom/server'
import { match } from 'redux-router/server'
import { ReduxRouter } from 'redux-router'
import { Provider } from 'react-redux'
import store from './src/store_server'
import { updateStrings as updateTimeAgoStrings } from './src/vendor/time_ago_in_words'

updateTimeAgoStrings({ about: '' })

const app = express()
let indexStr = ''
// grab out the index.html string first thing
fs.readFile(path.join(__dirname, './public/index.html'), 'utf-8', (err, data) => {
  if (!err) {
    indexStr = data
  }
})

// Assets
app.use(express.static('public'))
app.use('/static', express.static('public/static'))

// Auth token
// Get the access token object.
const credentials = {
  clientID: process.env.AUTH_CLIENT_ID,
  clientSecret: process.env.AUTH_CLIENT_SECRET,
  site: process.env.AUTH_DOMAIN,
  tokenPath: '/api/oauth/token',
  headers: {
    'Accept': 'application/json',
  },
}

// Initialize the OAuth2 Library
const oauth2 = require('simple-oauth2')(credentials)
const tokenConfig = {}
let token = null

// Get the access token object for the client
oauth2.client
  .getToken(tokenConfig)
  .then((result) => {
    if (result.errors) {
      console.log('Unable to get access token', result)
      process.exit(1)
    }
    token = oauth2.accessToken.create(result)
  })
  .catch((error) => {
    console.log('Access Token error', error.message)
    process.exit(1)
  })

app.get('/token', (req, res) => {
  if (token.expired()) {
    token.refresh().then((result) => {
      if (result.errors) {
        console.log('Access Token error', result)
        res.status(401).send(result.errors)
      } else {
        token = result
        res.status(200).send(token)
      }
    }).catch((error) => {
      console.log('Access Token error', error.message)
      res.status(401).send()
    })
  } else {
    res.status(200).send(token)
  }
})

// Return promises for initial loads
function preRender(routerState) {
  const promises = routerState.components.map(component => (component && component.preRender) ? component.preRender(store, routerState) : null).filter(component => !!component)
  return Promise.all(promises)
}

function renderFromServer(req, res) {
  store.dispatch(match(req.url, (error, redirectLocation, routerState) => {
    if (error) {
      console.log('error', error)
    }
    if (redirectLocation) {
      console.log('handle redirect')
    }
    if (!routerState) { return }
    preRender(routerState).then(() => {
      const InitialComponent = (
        <Provider store={store}>
          <ReduxRouter />
        </Provider>
      )
      const componentHTML = renderToString(InitialComponent)
      const state = store.getState()
      state.authentication.isLoggedIn = false
      const initialStateTag = `<script id="initial-state">window.__INITIAL_STATE__ = ${JSON.stringify(state)}</script>`
      indexStr = indexStr.replace('<div id="root"></div>', `<div id="root">${componentHTML}</div>${initialStateTag}`)
      res.send(indexStr)
    }).catch((err) => {
      // this will give you a js error like:
      // `window is not defined`
      console.log('ERROR', err)
    })
  }))
}

const loggedOutPaths = {
  find: /\/find$/,
  root: /\/$/,
  recent: /\/recent$/,
  trending: /\/trending$/,
}

app.use((req, res) => {
  let isLoggedOutPath = false
  for (const re in loggedOutPaths) {
    if (req.url.match(loggedOutPaths[re])) {
      isLoggedOutPath = true
      break
    }
  }
  console.log('url', req.url, isLoggedOutPath)
  if (isLoggedOutPath) {
    renderFromServer(req, res)
  } else {
    res.send(indexStr)
  }
})

const port = process.env.PORT || 6660
app.listen(port, (err) => {
  if (err) {
    console.log(err)
    return
  }
  console.log('Listening at http://localhost:' + port)
})

