import thunk from 'redux-thunk'
import createLogger from 'redux-logger'
import { browserHistory } from 'react-router'
import { routerMiddleware } from 'react-router-redux'
import { combineReducers, compose, createStore, applyMiddleware } from 'redux'
import { autoRehydrate } from 'redux-persist'
import { analytics, authentication, requester, uploader } from './middleware'
import * as reducers from './reducers'

const reducer = combineReducers({
  ...reducers,
})



const createBrowserStore = (history = browserHistory) => {
  const logger = createLogger({ collapsed: true, predicate: () => ENV.APP_DEBUG })
  const reduxRouterMiddleware = routerMiddleware(history)

  const initialState = window.__INITIAL_STATE__ || {}
  // react-router-redux doesn't know how to serialize
  // query params from server-side rendering, so we just kill it
  // and let the browser reconstruct the router state
  initialState.routing = {}

  const store = compose(
    autoRehydrate(),
    applyMiddleware(
      thunk,
      authentication,
      reduxRouterMiddleware,
      uploader,
      requester,
      analytics,
      logger
    ),
  )(createStore)(reducer, initialState || {})

  return store
}

const createServerStore = (history) => {
  const reduxRouterMiddleware = routerMiddleware(history)
  const store = compose(
    applyMiddleware(thunk, uploader, reduxRouterMiddleware, requester),
  )(createStore)(reducer, {})

  return store
}

const createElloStore = (history = null) => {
  if (typeof window !== 'undefined') return createBrowserStore()
  return createServerStore(history)
}

export { createElloStore }

export default createElloStore()
