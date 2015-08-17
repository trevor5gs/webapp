import React from 'react'
import ChannelUser from './ChannelUser'
import OnboardingHeader from './OnboardingHeader'

export function channels(json, vo) {
  return(
    <div>
      <OnboardingHeader
        nextPath='/onboarding/awesome-people'
        title='What are you interested in?'
        message='Follow ello communities' />
      <div>
        {json.map(function(user, i) {
          return <ChannelUser user={user} key={i} />
        })}
      </div>
    </div>
  )
}

export function simpleUserGrid(json) {
  return(
    <div>
      <OnboardingHeader
        nextPath='/onboarding/profile-header'
        title='Awesome Peeps'
        message='Follow awesome peeps' />
      <ul>
        {json.map(function(user, i) {
          return <li key={i}>@{user.username}</li>
          })}
      </ul>
    </div>
  )
}

export function profileHeaderView() {
  return (
    <div>
      <OnboardingHeader
        nextPath='/onboarding/profile-avatar'
        title='Profile Header view'
        message='Add a header' />
      <div>PROFILE HEADER VIEW</div>
    </div>
  )
}

export function profileAvatarView() {
  return (
    <div>
      <OnboardingHeader
        nextPath='/friends'
        title='Add an avatar'
        message='Add an avatar' />
      <div>PROFILE AVATAR VIEW</div>
    </div>
  )
}

