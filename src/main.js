import 'babel-core/polyfill'

import React from 'react';
import thunk from 'redux-thunk'
import { Router, Route } from 'react-router'
import BrowserHistory from 'react-router/lib/BrowserHistory'
import { reduxRouteComponent, routerStateReducer } from 'redux-react-router'
import { createStore, applyMiddleware, combineReducers } from 'redux'
import { Provider } from 'react-redux'
import * as reducers from './reducers'
import { logger, requester } from './middleware'
import Routes from './routes'

const history = new BrowserHistory()
const createStoreWithMiddleware = applyMiddleware(thunk, requester, logger)(createStore)
const reducer = combineReducers({ router: routerStateReducer, ...reducers })
const store = createStoreWithMiddleware(reducer)

const element = (
  <Provider store={store}>
    {() =>
      <Router history={history}>
        <Route component={reduxRouteComponent(store)} children={Routes} />
      </Router>
    }
  </Provider>
)
React.render(element, document.body)


// TODO: Move `./routes` to `./containers/Routes`
// The react router is really a react component

