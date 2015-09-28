import React from 'react'
import PersonCard from '../people/PersonCard'
import PersonGrid from '../people/PersonGrid'

export function onboardingCommunities(jsonables) {
  return (
    <div className="Cards">
      {jsonables.map((user, i) => {
        return <PersonCard ref={'personCard_' + i} user={user} key={i} />
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
}

export function postsAsGrid(posts, json) {
  return (
    <div className="Posts as-grid">
      <ul>
        {posts.map((post, i) => {
          const author = getLinkObject(post, 'author', json)
          return <li>{`${author.username} - post ${i} token: ${post.token}`}</li>
          // console.log('post ' + i, post)
          // console.log('author ' + i, getLinkObject(post, 'author', json))
          // console.log('author ' + i, json.users[post.authorId])
        })}
      </ul>
    </div>
  )
}


// export function notificationsAsList(json) {
// }

export { getLinkObject }
