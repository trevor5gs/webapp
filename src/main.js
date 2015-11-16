import './main.sass'
import 'babel-core/polyfill'
import 'isomorphic-fetch'

import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { ReduxRouter } from 'redux-router'
import { updateStrings as updateTimeAgoStrings } from './vendor/time_ago_in_words'
import { persistStore } from 'redux-persist'
import localforage from 'localforage'
import store from './store'

import './vendor/embetter'
import './vendor/embetter_initializer'

updateTimeAgoStrings({about: ''})

const storage = localforage.createInstance({ name: 'ello-webapp' })
// check and update current version and
// only kill off the persisted reducers
if (ENV.APP_VERSION) {
  const curVersion = storage.getItem('APP_VERSION')
  if (curVersion && ENV.APP_VERSION && curVersion !== ENV.APP_VERSION) {
    for (const item of ['json', 'profile', 'stream']) {
      storage.removeItem(`reduxPersist:${item}`)
    }
  }
  storage.setItem('APP_VERSION', ENV.APP_VERSION)
}

const element = (
  <Provider store={store}>
    <ReduxRouter />
  </Provider>
)

persistStore(store, { storage, blacklist: ['router', 'modals'] }, () => {
  ReactDOM.render(element, document.getElementById('root'))
})

