import 'babel-core/polyfill'

import React from 'react'
import Router from 'react-router'
import BrowserHistory from 'react-router/lib/BrowserHistory'
import { createStore, applyMiddleware, combineReducers } from 'redux'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'
import * as reducers from './reducers'
import logger from './middleware/logger'
import callAPI from './middleware/callAPIMiddleware'
import routes from './routes'

const history = new BrowserHistory()
const createStoreWithMiddleware = applyMiddleware(thunk, callAPI, logger)(createStore)
const reducer = combineReducers(reducers)
const store = createStoreWithMiddleware(reducer)

const element = (
  <Provider store={store}>
    {() => <Router history={history} routes={routes} /> }
  </Provider>
);
React.render(element, document.body)

