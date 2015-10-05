import './main.sass'
import 'babel-core/polyfill'

import React from 'react'
import thunk from 'redux-thunk'
import createLogger from 'redux-logger'
import { Router } from 'react-router'
import createBrowserHistory from 'history/lib/createBrowserHistory'
import { createStore, applyMiddleware, combineReducers } from 'redux'
import { Provider } from 'react-redux'
import * as reducers from './reducers'
import { analytics, uploader, requester } from './middleware'
import App from './containers/App'

import './util/time_ago_in_words'
import './vendor/embetter'

// TODO: move this somewhere else?
window.embetter.activeServices = [
  window.embetter.services.youtube,
  window.embetter.services.vimeo,
  window.embetter.services.soundcloud,
  window.embetter.services.dailymotion,
  window.embetter.services.mixcloud,
  window.embetter.services.codepen,
  window.embetter.services.bandcamp,
  window.embetter.services.ustream,
]
window.embetter.reloadPlayers = (el = document.body) => {
  window.embetter.utils.disposeDetachedPlayers()
  window.embetter.utils.initMediaPlayers(el, window.embetter.activeServices)
}
window.embetter.stopPlayers = (el = document.body) => {
  window.embetter.utils.unembedPlayers(el)
  window.embetter.utils.disposeDetachedPlayers()
}
window.embetter.removePlayers = (el = document.body) => {
  window.embetter.stopPlayers(el)
  for (const ready of el.querySelectorAll('.embetter-ready')) {
    ready.classList.remove('embetter-ready')
  }
  for (const statix of el.querySelectorAll('.embetter-static')) {
    statix.classList.remove('embetter-static')
  }
}
window.embetter.reloadPlayers()

const logger = createLogger({ collapsed: true })
const createStoreWithMiddleware = applyMiddleware(thunk, uploader, requester, analytics, logger)(createStore)
const reducer = combineReducers(reducers)
const store = createStoreWithMiddleware(reducer)

function createRedirect(from, to) {
  return {
    path: from,
    onEnter(nextState, replaceState) {
      replaceState(nextState, to)
    },
  }
}

const rootRoute = {
  path: '/',
  component: App,
  childRoutes: [
    createRedirect('onboarding', '/onboarding/communities'),
    require('./routes/discover'),
    require('./routes/onboarding'),
  ],
}

const element = (
  <Provider store={store}>
    {() =>
      <Router history={createBrowserHistory()} routes={rootRoute} />
    }
  </Provider>
)

React.render(element, document.getElementById('root'))
