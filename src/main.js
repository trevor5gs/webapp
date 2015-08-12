import 'babel-core/polyfill'

import React from 'react'
import Router from 'react-router'
import BrowserHistory from 'react-router/lib/BrowserHistory'
import { createStore, applyMiddleware, combineReducers } from 'redux'
import { Provider } from 'react-redux'
import * as reducers from './reducers'
import thunk from 'redux-thunk'
import { logger, promiser } from './middleware'
import routes from './routes'

const history = new BrowserHistory()
const createStoreWithMiddleware = applyMiddleware(thunk, promiser, logger)(createStore)
const reducer = combineReducers(reducers)
const store = createStoreWithMiddleware(reducer)

const element = (
  <Provider store={store}>
    {() => <Router history={history} routes={routes} /> }
  </Provider>
);
React.render(element, document.body)

