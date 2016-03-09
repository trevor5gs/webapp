import './main.sass'
import 'babel-polyfill'
import 'isomorphic-fetch'

import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { Router } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'
import { updateStrings as updateTimeAgoStrings } from './vendor/time_ago_in_words'
import { persistStore } from 'redux-persist'
import localforage from 'localforage'
import store from './store'
import { browserHistory } from 'react-router'
import routes from './routes'

import './vendor/embetter'
import './vendor/embetter_initializer'

updateTimeAgoStrings({ about: '' })

const APP_VERSION = '1.0.10'

const history = syncHistoryWithStore(browserHistory, store)
const element = (
  <Provider store={store}>
    <Router history={history} routes={routes(store)} />
  </Provider>
)

const storage = localforage.createInstance({ name: 'ello-webapp' })
const whitelist = ['authentication', 'editor', 'gui', 'json', 'profile']
const persistor = persistStore(store, { storage, whitelist }, () => {
  ReactDOM.render(element, document.getElementById('root'))
})

// check and update current version and
// only kill off the persisted reducers
storage.getItem('APP_VERSION')
  .then((curVersion) => {
    if (curVersion && curVersion !== APP_VERSION) {
      // we can't use purgeAll since localforage
      // doesn't implement the getAllKeys method
      persistor.purge(whitelist)
    }
    storage.setItem('APP_VERSION', APP_VERSION)
  })

