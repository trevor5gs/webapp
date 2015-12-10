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
import { clientAccessToken } from './src/networking/api'
import { updateStrings as updateTimeAgoStrings } from './src/vendor/time_ago_in_words'
import * as ENV from './env'

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
      console.log('AUTHENTICATION', state.authentication)
      // by default the components in the router are null
      // so to get around that we'll delete them see:
      // https://github.com/rackt/redux-router/issues/60
      delete state.router
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

app.use((req, res) => {
  if (req.url.match(/\/join$/)) {
    renderFromServer(req, res)
  } else {
    res.send(indexStr)
  }
})

const port = ENV.PORT || 6660
app.listen(port, (err) => {
  if (err) {
    console.log(err)
    return
  }
  console.log('Listening at http://localhost:' + port)
})

