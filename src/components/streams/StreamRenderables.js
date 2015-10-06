import React from 'react'
import PersonCard from '../people/PersonCard'
import PersonGrid from '../people/PersonGrid'
import { parsePost } from '../posts/PostParser'
import { getLinkArray } from '../../util/json_helper'

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
  console.log('postsAsGrid', posts)
  return (
    <div className="Posts as-grid" key="postsAsGrid">
      {posts.map((post, i) => {
        return (
          <div ref={`postAsGrid_${i}_${post.id}`} key={`postAsGrid_${i}_${post.id}`} className="PostGrid">
            {parsePost(post, json)}
          </div>
        )
      })}
    </div>
  )
}

export function userDetail(users, json) {
  console.log('userDetail', users)
  const posts = getLinkArray(users[0], 'posts', json)
  return postsAsGrid(posts, json)
}

export function postDetail(posts, json) {
  const post = posts[0]
  const comments = getLinkArray(post, 'comments', json)
  console.log('postDetail', post, comments)
  return (
    <div ref={`postDetail_${i}_${post.id}`} key={`postDetail_${i}_${post.id}`} className="PostList">
      {parsePost(post, json)}
    </div>
  )
}

