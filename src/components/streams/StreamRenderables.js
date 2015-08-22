import React from 'react'
import ChannelCard from '../people/ChannelCard'

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
    <ul className="People as-grid">
      {json.map((user, i) => {
        return <li key={i}>@{user.username}</li>
      })}
    </ul>
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

