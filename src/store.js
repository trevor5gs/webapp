import thunk from 'redux-thunk'
import createLogger from 'redux-logger'
import createBrowserHistory from 'history/lib/createBrowserHistory'
import { compose, createStore, applyMiddleware } from 'redux'
import { autoRehydrate } from 'redux-persist'
import { reduxReactRouter, routerStateReducer } from 'redux-router'
import { analytics, uploader, requester } from './middleware'
import routes from './routes'
import * as reducers from './reducers'

const logger = createLogger({ collapsed: true, predicate: () => ENV.APP_DEBUG })
function reducer(state, action) {
  return {
    accessToken: reducers.accessToken(state.accessToken, action),
    json: reducers.json(state.json, action, state.router),
    modal: reducers.modal(state.modal, action),
    profile: reducers.profile(state.profile, action),
    router: routerStateReducer(state.router, action),
    search: reducers.search(state.search, action),
    stream: reducers.stream(state.stream, action),
  }
}
const store = compose(
  autoRehydrate(),
  applyMiddleware(thunk, uploader, requester, analytics, logger),
  reduxReactRouter({routes: routes, createHistory: createBrowserHistory})
)(createStore)(reducer, window.__INITIAL_STATE__ || {})

export default store
