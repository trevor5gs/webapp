import thunk from 'redux-thunk'
import createLogger from 'redux-logger'
import { compose, createStore, applyMiddleware } from 'redux'
import { autoRehydrate } from 'redux-persist'
import { analytics, uploader, requester } from './middleware'
import * as reducers from './reducers'
import { routeReducer } from 'redux-simple-router'

const logger = createLogger({ collapsed: true, predicate: () => ENV.APP_DEBUG })
function reducer(state, action) {
  return {
    authentication: reducers.authentication(state.authentication, action),
    json: reducers.json(state.json, action, state.router),
    modal: reducers.modal(state.modal, action),
    profile: reducers.profile(state.profile, action),
    router: routeReducer(state.router, action),
    search: reducers.search(state.search, action),
    stream: reducers.stream(state.stream, action),
  }
}

const store = compose(
  autoRehydrate(),
  applyMiddleware(thunk, uploader, requester, analytics, logger),
)(createStore)(reducer, window.__INITIAL_STATE__ || {})

export default store

