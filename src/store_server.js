import thunk from 'redux-thunk'
import createHistory from 'history/lib/createHistory'
import { compose, createStore, applyMiddleware } from 'redux'
import { routerStateReducer } from 'redux-router'
import { reduxReactRouter } from 'redux-router/server'
import { analytics, uploader, requester } from './middleware'
import routes from './routes'
import * as reducers from './reducers'

function reducer(state, action) {
  return {
    accessToken: reducers.accessToken(state.accessToken, action),
    authentication: reducers.authentication(state.authentication, action),
    json: reducers.json(state.json, action, state.router),
    modal: reducers.modal(state.modal, action),
    profile: reducers.profile(state.profile, action),
    router: routerStateReducer(state.router, action),
    search: reducers.search(state.search, action),
    stream: reducers.stream(state.stream, action),
  }
}

const store = compose(
  applyMiddleware(thunk, uploader, requester, analytics),
  reduxReactRouter({ routes: routes, createHistory: createHistory })
)(createStore)(reducer, {})

export default store

