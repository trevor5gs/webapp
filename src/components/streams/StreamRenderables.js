import React from 'react'
import ChannelCard from '../channels/ChannelCard'
import PersonGrid from '../people/PersonGrid'

export function onboardingChannels(json) {
  return (
    <div className="Channels">
      {json.map((user, i) => {
        return <ChannelCard user={user} key={i} />
      })}
    </div>
  )
}

export function onboardingPeople(json) {
  return (
    <div className="People as-grid">
      {json.map((user, i) => {
        return <PersonGrid user={user} key={i} />
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

