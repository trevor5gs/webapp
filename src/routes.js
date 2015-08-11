import React from 'react'
import { Route, Redirect } from 'react-router'
import Root from './components/root'
import Onboarding from './components/onboarding'

export default (
  <Route name="app" component={Root}>
    <Route path="onboarding" component={Onboarding} />
    <Redirect from='/' to='onboarding' />
  </Route>
)

