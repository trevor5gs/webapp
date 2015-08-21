import './main.sass'
import 'babel-core/polyfill'

import React from 'react'
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
import SearchView from './components/views/SearchView'
import DiscoverView from './components/views/DiscoverView'
import { ChannelPicker, PeoplePicker, HeaderPicker, AvatarPicker } from './components/views/OnboardingView'

const history = new BrowserHistory()
const createStoreWithMiddleware = applyMiddleware(thunk, requester, logger)(createStore)
const reducer = combineReducers({ router: routerStateReducer, ...reducers })
const store = createStoreWithMiddleware(reducer)

const element = (
  <Provider store={store}>
    {() =>
      <Router history={history}>
        <Route component={reduxRouteComponent(store)}>
          <Route path="/" component={App}>
            <Route path="search" component={SearchView} />
            <Route path="discover" component={DiscoverView} />
            <Route path="onboarding">
              <Route path="channels" component={ChannelPicker} />
              <Route path="awesome-people" component={PeoplePicker} />
              <Route path="profile-header" component={HeaderPicker} />
              <Route path="profile-avatar" component={AvatarPicker} />
              <Redirect from="onboarding" to="channels" />
            </Route>
          </Route>
        </Route>
      </Router>
    }
  </Provider>
)

React.render(element, document.getElementById('root'))

