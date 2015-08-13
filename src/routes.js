import React from 'react'
import { Route, Redirect } from 'react-router'
import App from './containers/App'
import StreamView from './containers/StreamView'

export default (
  <Route name='app' component={App}>
    <Route path='onboarding'>
      <Route path='communities' component={StreamView} />
      <Route path='awesome-people' component={StreamView} />
    </Route>
    <Redirect from='/' to='onboarding/communities' />
  </Route>
)

