import React from 'react'
import { Route } from 'react-router'
import StreamView from '../containers/StreamView'
import StaticView from '../containers/StaticView'
import ProfileHeader from '../components/ProfileHeader'
import * as OnboardingActions from '../actions/onboarding_actions'

export class OnboardingApp {
  render() {
    return (
      <div className='onboarding-app'>
        {this.props.children}
      </div>
    )
  }
}

export let onboardingRoutes = (store) => {
  return (
    <div>
      <Route path='channels' component={StreamView}
            onEnter={() => store.dispatch(OnboardingActions.loadChannels())} />
      <Route path='awesome-people' component={StreamView}
            onEnter={() => store.dispatch(OnboardingActions.loadAwesomePeople())} />
      <Route path='profile-header' component={StaticView}
            onEnter={() => store.dispatch(OnboardingActions.loadProfileHeader())} />
      <Route path='profile-avatar' component={StaticView}
            onEnter={() => store.dispatch(OnboardingActions.loadProfileAvatar())} />
    </div>
  )
}

