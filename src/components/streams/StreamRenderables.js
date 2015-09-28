import React from 'react'
import PersonCard from '../people/PersonCard'
import PersonGrid from '../people/PersonGrid'
import PostGrid from '../posts/PostGrid'

export function onboardingCommunities(users) {
  return (
    <div className="Cards">
      {users.map((user, i) => {
        return <PersonCard ref={'personCard_' + i} user={user} key={i} />
      })}
    </div>
  )
}

export function onboardingPeople(users) {
  return (
    <div className="People as-grid">
      {users.map((user, i) => {
        return <PersonGrid ref={'personGrid_' + i} user={user} key={i} />
      })}
    </div>
  )
}

function getLinkObject(model, identifier, json) {
  const key = model.links[identifier].id || model.links[identifier]
  const collection = model.links[identifier].type || identifier
  if (key && json[collection]) {
    return json[collection][key]
  }
}

function getLinkArray(model, identifier, json) {
  const keys = model.links[identifier].ids || model.links[identifier]
  const collection = model.links[identifier].type || identifier
  if (keys.length && json[collection]) {
    return keys.map((key) => {
      return json[collection][key]
    })
  }
}

export function userDetail(users, json) {
  const author = users[0]
  const posts = getLinkArray(users[0], 'posts', json)
  return (
    <div className="UserDetail as-grid">
      {onboardingPeople(users, json)}
      {postsAsGrid(posts, json, author)}
    </div>
  )
}

function textRegionRender(region) {
  return region.data
}

export function postsAsGrid(posts, json, user) {
  return (
    <div className="Posts as-grid">
      <ul>
        {posts.map((post, i) => {
          return <PostGrid ref={'postGrid_' + i} post={post} author={user || getLinkObject(post, 'author', json)} assets={json.assets} key={i} />
        })}
      </ul>
    </div>
  )
}



// export function notificationsAsList(json) {
// }

export { getLinkObject }
