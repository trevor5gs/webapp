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

function getLinkObject(model, identifier, json) {
  const key = model.links[identifier].id
  const collection = model.links[identifier].type
  if (key && collection) {
    return json[collection][key]
  }
  if (!id) {
    id = model.links[identifier].type
  }
}

export function postsAsGrid(posts, json) {
  return (
    <div className="Posts as-grid">
      {posts.map((post, i) => {
        console.log('post ' + i, post)
        console.log('author ' + i, getLinkObject(post, 'author', json))
        // console.log('author ' + i, json.users[post.authorId])
      })}
    </div>
  )
}


// export function notificationsAsList(json) {
// }

export { getLinkObject }
