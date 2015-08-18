import React from 'react'
import * as OnboardingActions from '../../actions/onboarding_actions'
import StreamComponent from '../StreamComponent'
import OnboardingHeader from '../OnboardingHeader'

export class ChannelPicker extends React.Component {
  render() {
    return (
      <div className='panel'>
        <OnboardingHeader
          nextPath='/onboarding/awesome-people'
          title='What are you interested in?'
          message='Follow ello communities' />
        <StreamComponent action={OnboardingActions.loadChannels} />
      </div>
    )
  }
}

export class PeoplePicker extends React.Component {
  render() {
    return (
      <div className='panel'>
        <OnboardingHeader
          nextPath='/onboarding/profile-header'
          title='Awesome Peeps'
          message='Follow awesome peeps' />
        <StreamComponent action={OnboardingActions.loadAwesomePeople} />
      </div>
    )
  }
}

export class HeaderPicker extends React.Component {
  render() {
    return (
      <div className='panel'>
        <OnboardingHeader
          nextPath='/onboarding/profile-avatar'
          title='Profile Header view'
          message='Add a header' />
        <div>PROFILE HEADER VIEW</div>
      </div>
    )
  }
}

export class AvatarPicker extends React.Component {
  render() {
    return (
      <div className="panel">
        <OnboardingHeader
        nextPath='/'
        title='Add an avatar'
        message='Add an avatar' />
        <div>Stuff goes here</div>
      </div>
    )
  }
}
