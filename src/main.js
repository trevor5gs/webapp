import './main.sass'
import 'babel-core/polyfill'

import React from 'react'
import thunk from 'redux-thunk'
import createLogger from 'redux-logger'
import { Router, Route, Redirect } from 'react-router'
import BrowserHistory from 'react-router/lib/BrowserHistory'
import { createStore, applyMiddleware, combineReducers } from 'redux'
import { Provider } from 'react-redux'
import * as reducers from './reducers'
import { requester } from './middleware'
import App from './containers/App'
import SearchView from './components/views/SearchView'
import DiscoverView from './components/views/DiscoverView'
import { ChannelPicker, PeoplePicker, HeaderPicker, AvatarPicker, BioCreator } from './components/views/OnboardingView'

const history = new BrowserHistory()
const logger = createLogger({ collapsed: true })

const createStoreWithMiddleware = applyMiddleware(thunk, requester, logger)(createStore)
const reducer = combineReducers(reducers)
const store = createStoreWithMiddleware(reducer)

const element = (
  <Provider store={store}>
    {() =>
      <Router history={history}>
        <Route path="/" component={App}>
          <Route path="search" component={SearchView} />
          <Route path="discover" component={DiscoverView} />
          <Route path="onboarding">
            <Route path="channels" component={ChannelPicker} />
            <Route path="awesome-people" component={PeoplePicker} />
            <Route path="profile-header" component={HeaderPicker} />
            <Route path="profile-avatar" component={AvatarPicker} />
            <Route path="profile-bio" component={BioCreator} />
            <Redirect from="onboarding" to="channels" />
          </Route>
        </Route>
      </Router>
    }
  </Provider>
)

React.render(element, document.getElementById('root'))

