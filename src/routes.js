import React from 'react'
import { Route, Redirect } from 'react-router'
import App from './containers/App'
import Onboarding from './containers/Onboarding'

export default (
  <Route name='app' component={App}>
    <Route path='onboarding' component={Onboarding} />
    <Redirect from='/' to='onboarding' />
  </Route>
)

