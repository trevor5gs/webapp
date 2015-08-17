import 'babel-core/polyfill'

import React from 'react';
import thunk from 'redux-thunk'
import logger from 'redux-logger'
import { Router, Route, Redirect } from 'react-router'
import BrowserHistory from 'react-router/lib/BrowserHistory'
import { reduxRouteComponent, routerStateReducer } from 'redux-react-router'
import { createStore, applyMiddleware, combineReducers } from 'redux'
import { Provider } from 'react-redux'
import * as reducers from './reducers'
import { requester } from './middleware'
import * as Actions from './actions/community_actions'
import App from './containers/App'
import StreamView from './containers/StreamView'
import StaticView from './containers/StaticView'

const history = new BrowserHistory()
const createStoreWithMiddleware = applyMiddleware(thunk, requester, logger)(createStore)
const reducer = combineReducers({ router: routerStateReducer, ...reducers })
const store = createStoreWithMiddleware(reducer)


const element = (
  <Provider store={store}>
    {() =>
      <Router history={history}>
        <Route component={reduxRouteComponent(store)}>
          <Route component={App}>
            <Route path='onboarding'>
              <Route path='channels' component={StreamView}
                    onEnter={() => store.dispatch(Actions.loadChannels())} />
              <Route path='awesome-people' component={StreamView}
                    onEnter={() => store.dispatch(Actions.loadAwesomePeople())} />
              <Route path='profile-header' component={StaticView}
                    onEnter={() => store.dispatch(Actions.loadProfileHeader())} />
              <Route path='profile-avatar' component={StaticView}
                    onEnter={() => store.dispatch(Actions.loadProfileAvatar())} />
            </Route>
          </Route>
        </Route>
        <Redirect from='/' to='onboarding/channels' />
      </Router>
    }
  </Provider>
)

React.render(element, document.getElementById('root'))

