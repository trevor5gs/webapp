import React from 'react'
import { Route, Redirect } from 'react-router'
import App from './containers/App'
import Onboarding from './containers/Onboarding'
import UserView from './components/UserView'

export default (
  <Route name='app' component={App}>
    <Route path='onboarding' component={Onboarding}>
      <Route path='communities' component={UserView} />
      <Route path='awesome-people' component={UserView} />
    </Route>
    <Redirect from='/' to='onboarding/communities' />
  </Route>
)

