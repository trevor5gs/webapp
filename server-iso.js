// import 'newrelic'
import express from 'express'
import React from 'react'
import { renderToString } from 'react-dom/server'
import { match } from 'redux-router/server'
import store from './src/store_server'
import { ReduxRouter } from 'redux-router'
import { Provider } from 'react-redux'
import * as ENV from './env'

// need to import anything that would be used in rendering
import { updateStrings as updateTimeAgoStrings } from './src/vendor/time_ago_in_words'
updateTimeAgoStrings({about: ''})

import 'isomorphic-fetch'

const app = express()

// Assets
app.use(express.static('public'))
app.use('/static', express.static('public/static'))

// Return promises for initial loads
function preRender(routerState) {
  const promises = routerState.components.map(component => (component && component.preRender) ? component.preRender(store, routerState) : null).filter(component => !!component)
  return Promise.all(promises)
}

// template to render full page
function renderFullPage(html, initialState) {
  return `
    <!doctype html>
    <html>
      <head>
        <title>Ello | Be inspired.</title>
        <link href="/static/bundle.css" rel="stylesheet"></link>
      </head>
      <body>
        <div id="root">${html}</div>
        <script>
          window.__INITIAL_STATE__ = ${JSON.stringify(initialState)}
        </script>
        <script src="/static/commons.entry.js"></script>
        // <script src="/static/auth.entry.js"></script>
        <script src="/static/main.entry.js"></script>
      </body>
    </html>
    `
}

app.use((req, res) => {
  store.dispatch(match(req.url, (error, redirectLocation, routerState) => {
    if (error) {
      console.log('error', error)
    }
    if (redirectLocation) {
      console.log('handle redirect')
    }
    console.log('routerState', routerState)
    if (!routerState) { return }
    preRender(routerState).then(() => {
      const InitialComponent = (
        <Provider store={store}>
          <ReduxRouter />
        </Provider>
      )
      // need to do this to get the fetches to kick off
      const componentHTML = renderToString(InitialComponent)
      res.send(renderFullPage(componentHTML, store.getState()))
    }).catch((err) => {
      // this will give you a js error like:
      // `window is not defined`
      console.log('ERROR', err)
    })
  }))
})

const port = ENV.PORT || 6660
app.listen(port, (err) => {
  if (err) {
    console.log(err)
    return
  }
  console.log('Listening at http://localhost:' + port)
})

