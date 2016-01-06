import './main.sass'
import 'babel-polyfill'
import 'isomorphic-fetch'

import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { Router } from 'react-router'
import { updateStrings as updateTimeAgoStrings } from './vendor/time_ago_in_words'
import { persistStore } from 'redux-persist'
import localforage from 'localforage'
import store from './store'
import * as ACTION_TYPES from './constants/action_types'
import { browserHistory } from 'react-router'
import { syncReduxAndRouter } from 'redux-simple-router'
import routes from './routes'

import './vendor/embetter'
import './vendor/embetter_initializer'

updateTimeAgoStrings({ about: '' })

const element = (
  <Provider store={store}>
    <Router history={browserHistory} routes={routes} />
  </Provider>
)

const storage = localforage.createInstance({ name: 'ello-webapp' })
const persistor = persistStore(store, { storage, blacklist: ['router', 'modal'] }, () => {
  // wait to sync the router until store is persisted
  // this prevents the initial re route to the home page
  syncReduxAndRouter(browserHistory, store, state => state.router)
  // this adds the 'more posts' to the existing result if present
  // so that a refresh won't have the 'more posts' button
  store.dispatch({ type: ACTION_TYPES.ADD_NEW_IDS_TO_RESULT })
  ReactDOM.render(element, document.getElementById('root'))
})

// check and update current version and
// only kill off the persisted reducers
if (ENV.APP_VERSION) {
  storage.getItem('APP_VERSION')
    .then((curVersion) => {
      if (curVersion && curVersion !== ENV.APP_VERSION) {
        persistor.purge(['authentication', 'json', 'profile', 'search', 'stream'])
      }
      storage.setItem('APP_VERSION', ENV.APP_VERSION)
    })
}

