import React from 'react'
import PersonCard from '../people/PersonCard'
import PersonGrid from '../people/PersonGrid'
import { parsePost } from '../posts/PostParser'
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

export function postsAsGrid(posts, json) {
  return (
    <div className="Posts as-grid">
      {posts.map((post, i) => {
        return (
          <div ref={'post_' + post.id} key={i} className="PostGrid">
            {parsePost(post, json)}
          </div>
        )
      })}
    </div>
  )
}

export function userDetail(users, json) {
  const posts = getLinkArray(users[0], 'posts', json)
  return postsAsGrid(posts, json)
}

