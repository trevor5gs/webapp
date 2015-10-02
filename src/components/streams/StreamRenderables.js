import React from 'react'
import PersonCard from '../people/PersonCard'
import PersonGrid from '../people/PersonGrid'
import PostGrid from '../posts/PostGrid'
import { getLinkObject, getLinkArray } from '../../util/json_helper'

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

export function postsAsGrid(posts, json, user) {
  return (
    <div className="Posts as-grid">
      {posts.map((post, i) => {
        return (
          <PostGrid
            assets={json.assets}
            author={user || getLinkObject(post, 'author', json)}
            key={i}
            post={post}
            ref={'postGrid_' + i}
            repostAuthor={user || getLinkObject(post, 'repostAuthor', json)}
            repostSource={getLinkObject(post, 'repostedSource', json)} />
        )
      })}
    </div>
  )
}

export function userDetail(users, json) {
  const author = users[0]
  const posts = getLinkArray(users[0], 'posts', json)
  return postsAsGrid(posts, json, author)
}

export { getLinkObject, getLinkArray }

