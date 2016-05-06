import './main.sass'
import 'babel-polyfill'
import 'isomorphic-fetch'

import Honeybadger from 'honeybadger-js'
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { Router, browserHistory } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'
import { addFeatureDetection } from './vendor/jello'
import { scrollToOffsetTop } from './vendor/scrollTop'
import { updateStrings as updateTimeAgoStrings } from './vendor/time_ago_in_words'
import { persistStore, storages } from 'redux-persist'
import store from './store'
import routes from './routes'
import session from './vendor/session'

import MemoryStore from './vendor/memory_store'

import './vendor/embetter'
import './vendor/embetter_initializer'

Honeybadger.configure({
  api_key: ENV.HONEYBADGER_API_KEY,
  environment: ENV.HONEYBADGER_ENVIRONMENT,
});

updateTimeAgoStrings({ about: '' })

const APP_VERSION = '1.0.18'

const history = syncHistoryWithStore(browserHistory, store)
const element = (
  <Provider store={ store }>
    <Router history={ history } routes={ routes(store) } />
  </Provider>
)

const whitelist = ['authentication', 'editor', 'gui', 'json', 'profile']

const launchApplication = (storage) => {
  addFeatureDetection()
  const persistor = persistStore(store, { storage, whitelist }, () => {
    const root = document.getElementById('root')
    ReactDOM.render(element, root)

    // Scroll fix for layouts with Covers and universal rendering Normally we
    // call this in componentDidMount, but for the server rendered pages that
    // happens well after the page has drawn. Calling it here tries to prevent
    // the jumpiness for the initial page load.
    const viewport = root.querySelector('.Viewport.isOffsetLayout')
    if (viewport) {
      scrollToOffsetTop()
    }
  })

  // check and update current version and
  // only kill off the persisted reducers
  storage.getItem('APP_VERSION', (error, result) => {
    storage.setItem('APP_VERSION', APP_VERSION, () => {})
    if (result && result !== APP_VERSION) {
      persistor.purgeAll()
      session.clear()
    }
  })
}

// this will fail in a safari private window
function isLocalStorageSupported() {
  if (typeof window === 'undefined') { return false }
  const testKey = 'test-localStorage'
  const storage = window.localStorage
  try {
    storage.setItem(testKey, '1')
    storage.removeItem(testKey)
    return true
  } catch (error) {
    return false
  }
}

if (isLocalStorageSupported()) {
  // use localStorage as indexedDB seems to
  // have issues in chrome and firefox private
  launchApplication(storages.asyncLocalStorage)
} else {
  // localStorage fails, use an in-memory store
  launchApplication(MemoryStore)
}

