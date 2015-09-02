import React from 'react'
import ChannelCard from '../channels/ChannelCard'
import PersonGrid from '../people/PersonGrid'

export function onboardingChannels(jsonables) {
  return (
    <div className="Channels">
      {jsonables.map((user, i) => {
        return <ChannelCard user={user} key={i} />
      })}
    </div>
  )
}

export function onboardingPeople(jsonables) {
  return (
    <div className="People as-grid">
      {jsonables.map((user, i) => {
        return <PersonGrid ref={'personGrid_' + i} user={user} key={i} />
      })}
    </div>
  )
}

// export function peopleAsList(json) {
// }


// export function peopleAsGrid(json) {
// }


// export function postsAsList(json) {
// }


// export function postsAsGrid(json) {
// }


// export function notificationsAsList(json) {
// }

