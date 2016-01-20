import thunk from 'redux-thunk'
import createLogger from 'redux-logger'
import { combineReducers, compose, createStore, applyMiddleware } from 'redux'
import { autoRehydrate } from 'redux-persist'
import { analytics, requester, uploader } from './middleware'
import * as reducers from './reducers'

const reducer = combineReducers(reducers)

let store = null
if (typeof window !== 'undefined') {
  const logger = createLogger({ collapsed: true, predicate: () => ENV.APP_DEBUG })
  store = compose(
    autoRehydrate(),
    applyMiddleware(thunk, uploader, requester, analytics, logger),
  )(createStore)(reducer, window.__INITIAL_STATE__ || {})
} else {
  store = compose(
    applyMiddleware(thunk, uploader, requester, analytics),
  )(createStore)(reducer, {})
}

export default store

