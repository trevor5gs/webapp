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
    require('./routes/Onboarding'),
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
