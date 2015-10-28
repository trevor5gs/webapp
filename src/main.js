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
import { persistStore, autoRehydrate } from 'redux-persist'
import { updateStrings as updateTimeAgoStrings } from './vendor/time_ago_in_words'

import './vendor/embetter'
import './vendor/embetter_initializer'

updateTimeAgoStrings({about: ''})

// check and update current version and
// only kill off the persisted reducers
if (ENV.APP_VERSION) {
  const curVersion = localStorage.getItem('ello_webapp_version')
  if (curVersion && ENV.APP_VERSION && curVersion !== ENV.APP_VERSION) {
    for (const item of ['devtools', 'json', 'modals', 'profile', 'stream']) {
      localStorage.removeItem(`reduxPersist:${item}`)
    }
  }
  localStorage.setItem('ello_webapp_version', ENV.APP_VERSION)
}

function createRedirect(from, to) {
  return {
    path: from,
    onEnter(nextState, replaceState) {
      replaceState(nextState, to)
    },
  }
}

const routes = [
  createRedirect('/', '/following'),
  {
    path: '/',
    component: App,
    childRoutes: [
      require('./routes/discover'),
      require('./routes/following'),
      require('./routes/notifications'),
      createRedirect('onboarding', '/onboarding/communities'),
      require('./routes/onboarding'),
      require('./routes/post_detail'),
      require('./routes/search'),
      require('./routes/starred'),
      require('./routes/user_detail'),
    ],
  },
]

const logger = createLogger({ collapsed: true })
function reducer(state = {}, action) {
  return {
    json: reducers.json(state.json, action, state.router),
    devtools: reducers.devtools(state.devtools, action),
    modals: reducers.modals(state.modals, action),
    profile: reducers.profile(state.profile, action),
    router: routerStateReducer(state.router, action),
    stream: reducers.stream(state.stream, action),
  }
}
const store = compose(
  autoRehydrate(),
  applyMiddleware(thunk, uploader, requester, analytics, logger),
  reduxReactRouter({routes: routes, createHistory: createBrowserHistory})
)(createStore)(reducer)

const element = (
  <Provider store={store}>
    <ReduxRouter />
  </Provider>
)

persistStore(store, { blacklist: ['router'] }, () => {
  ReactDOM.render(element, document.getElementById('root'))
})
