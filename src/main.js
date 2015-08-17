import 'babel-core/polyfill'

import React from 'react';
import thunk from 'redux-thunk'
import logger from 'redux-logger'
import { Router, Route, Redirect } from 'react-router'
import BrowserHistory from 'react-router/lib/BrowserHistory'
import { reduxRouteComponent, routerStateReducer } from 'redux-react-router'
import { createStore, applyMiddleware, combineReducers } from 'redux'
import { Provider } from 'react-redux'
import * as reducers from './reducers'
import { requester } from './middleware'
import App from './containers/App'
import { OnboardingApp, onboardingRoutes } from './containers/OnboardingApp'
import { SearchApp } from './containers/SearchApp'

const history = new BrowserHistory()
const createStoreWithMiddleware = applyMiddleware(thunk, requester, logger)(createStore)
const reducer = combineReducers({ router: routerStateReducer, ...reducers })
const store = createStoreWithMiddleware(reducer)

const element = (
  <Provider store={store}>
    {() =>
      <Router history={history}>
        <Route component={reduxRouteComponent(store)}>
          <Route component={App}>
            <Route path='onboarding' component={OnboardingApp} children={onboardingRoutes(store)} />
            <Route path='search' component={SearchApp} />
          </Route>
        </Route>
        <Redirect from='/' to='onboarding/channels' />
      </Router>
    }
  </Provider>
)

React.render(element, document.getElementById('root'))

