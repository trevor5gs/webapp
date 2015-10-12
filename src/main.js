import './main.sass'
import 'babel-core/polyfill'

import React from 'react'
import ReactDOM from 'react-dom'
import thunk from 'redux-thunk'
import createLogger from 'redux-logger'
import createBrowserHistory from 'history/lib/createBrowserHistory'
import { compose, createStore, applyMiddleware } from 'redux'
import { reduxReactRouter, routerStateReducer, ReduxRouter } from 'redux-router'
import { Provider } from 'react-redux'
import * as reducers from './reducers'
import { analytics, uploader, requester } from './middleware'
import App from './containers/App'

import './vendor/embetter'
import './vendor/time_ago_in_words'

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
    require('./routes/post_detail'),
  ],
}

const logger = createLogger({ collapsed: true })
function reducer(state = {}, action) {
  return {
    json: reducers.json(state.json, action, state.router),
    devtools: reducers.devtools(state.devtools, action),
    modals: reducers.modals(state.modals, action),
    profile: reducers.profile(state.profile, action),
    router: routerStateReducer(state.router, action),
    stream: reducers.stream(state.stream, action),
    staticPage: reducers.staticPage(state.staticPage, action),
  }
}
const store = compose(
  applyMiddleware(thunk, uploader, requester, analytics, logger),
  reduxReactRouter({routes: rootRoute, createHistory: createBrowserHistory})
)(createStore)(reducer)

const element = (
  <Provider store={store}>
    <ReduxRouter />
  </Provider>
)

ReactDOM.render(element, document.getElementById('root'))
