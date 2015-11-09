import express from 'express'
import React from 'react'
import { renderToString } from 'react-dom/server'
import { match } from 'redux-router/server'
import store from '../src/store_server'
import { ReduxRouter } from 'redux-router'
import { Provider } from 'react-redux'
import * as ENV from '../env'

// need to import anything that would be used in rendering
import { updateStrings as updateTimeAgoStrings } from '../src/vendor/time_ago_in_words'
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
        <script src="/static/main.entry.js"></script>
      </body>
    </html>
    `
}

// this is helpful for now to get a token to add to `requester.js`
const url = 'https://' + ENV.AUTH_DOMAIN + '/api/oauth/authorize.html' +
  '?response_type=token' +
  '&scope=web_app' +
  '&client_id=' + ENV.AUTH_CLIENT_ID +
  '&redirect_uri=' + ENV.AUTH_REDIRECT_URI;
console.log(url.replace(/"/g, ''))

app.use((req, res) => {
  store.dispatch(match(req.url, (error, redirectLocation, routerState) => {
    if (error) {
      console.log('error', error)
    }
    if (redirectLocation) {
      console.log('handle redirect')
    }
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

app.listen(6660, 'localhost', (err) => {
  if (err) {
    console.log(err)
    return
  }
  console.log('Listening at http://localhost:6660')
})
