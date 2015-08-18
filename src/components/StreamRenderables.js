import React from 'react'
import ChannelUser from './ChannelUser'

export function onboardingChannels(json, vo) {
  return(
    <div className='people'>
      {json.map(function(user, i) {
        return <ChannelUser user={user} key={i} />
      })}
    </div>
  )
}

export function onboardingPeople(json) {
  return(
    <ul className='people as-grid'>
      {json.map(function(user, i) {
        return <li key={i}>@{user.username}</li>
      })}
    </ul>
  )
}

export function peopleAsList(json) {
}


export function peopleAsGrid(json) {
}


export function postsAsList(json) {
}


export function postsAsGrid(json) {
}


export function notificationsAsList(json) {
}

