import thunk from 'redux-thunk'
import createLogger from 'redux-logger'
import createBrowserHistory from 'history/lib/createBrowserHistory'
import { compose, createStore, applyMiddleware } from 'redux'
import { reduxReactRouter, routerStateReducer } from 'redux-router'
import { analytics, uploader, requester } from './middleware'
import { autoRehydrate } from 'redux-persist'
import routes from './routes'
import * as reducers from './reducers'

const logger = createLogger({ collapsed: true })
function reducer(state = {}, action) {
  return {
    json: reducers.json(state.json, action, state.router),
    devtools: reducers.devtools(state.devtools, action),
    modals: reducers.modals(state.modals, action),
    profile: reducers.profile(state.profile, action),
    router: routerStateReducer(state.router, action),
    stream: reducers.stream(state.stream, action),
  }
}
const store = compose(
  autoRehydrate(),
  applyMiddleware(thunk, uploader, requester, analytics, logger),
  reduxReactRouter({routes: routes, createHistory: createBrowserHistory})
)(createStore)(reducer)

export default store
