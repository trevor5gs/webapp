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
import OnboardingView from './components/views/OnboardingView'

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
            <Route path="channels" component={OnboardingView} subComponentName="ChannelPicker" />
            <Route path="awesome-people" component={OnboardingView} subComponentName="PeoplePicker" />
            <Route path="profile-header" component={OnboardingView} subComponentName="CoverPicker" />
            <Route path="profile-avatar" component={OnboardingView} subComponentName="AvatarPicker" />
            <Route path="profile-bio" component={OnboardingView} subComponentName="BioPicker" />
            <Redirect from="onboarding" to="channels" />
          </Route>
        </Route>
      </Router>
    }
  </Provider>
)

React.render(element, document.getElementById('root'))


function extractToken(hash) {
  const match = hash.match(/access_token=(\w+)/)
  let token = !!match && match[1]
  if (!token) {
    token = localStorage.getItem('ello_access_token')
  }
  return token
}

const token = extractToken(document.location.hash)
console.log('token', token)

if (token) {
  console.log('we got a token')
  localStorage.setItem('ello_access_token', token)
} else {
  // TODO: protocol, hostname, <port>, scope, client_id are all ENVs?
  const url = "http://ello.dev:5000/api/oauth/authorize.html" +
  "?response_type=token" +
  "&scope=web_app" + 
  "&client_id="    + "d27ce2715892fde84cb39225a71166337a9e041e466f5cbfe202104a51a59a59" +
  "&redirect_uri=" + "http://localhost:6660/"
  window.location.href = url
}
