import thunk from 'redux-thunk'
import createLogger from 'redux-logger'
import { compose, createStore, applyMiddleware } from 'redux'
import { autoRehydrate } from 'redux-persist'
import { analytics, requester, uploader } from './middleware'
import * as reducers from './reducers'

function reducer(state, action) {
  return {
    authentication: reducers.authentication(state.authentication, action),
    // TODO: look at using the UPDATE_PATH action from
    // redux-simple-router to see if we can revert this setup
    json: reducers.json(state.json, action, state.router),
    modal: reducers.modal(state.modal, action),
    profile: reducers.profile(state.profile, action),
    router: reducers.routing(state.router, action),
    stream: reducers.stream(state.stream, action),
  }
}

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

