import React from 'react'
import PersonCard from '../people/PersonCard'
import PersonGrid from '../people/PersonGrid'
import { parsePost } from '../posts/PostParser'
import { getLinkArray } from '../base/json_helper'

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

export function postsAsGrid(posts, json, currentUser) {
  return (
    <div className="Posts as-grid">
      {posts.map((post) => {
        return (
          <div ref={`postGrid_${post.id}`} key={post.id} className="PostGrid">
            {parsePost(post, json, currentUser)}
          </div>
        )
      })}
    </div>
  )
}

export function userDetail(users, json, currentUser) {
  const posts = getLinkArray(users[0], 'posts', json)
  return postsAsGrid(posts, json, currentUser)
}

export function postDetail(posts, json, currentUser) {
  const post = posts[0]
  // const comments = getLinkArray(post, 'comments', json)
  return (
    <div ref={`postList_${post.id}`} key={post.id} className="PostList">
      {parsePost(post, json, currentUser)}
    </div>
  )
}

