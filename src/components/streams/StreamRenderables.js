import React from 'react'
import UserCard from '../users/UserCard'
import UserGrid from '../users/UserGrid'
import { parsePost } from '../posts/PostParser'
import { getLinkArray } from '../base/json_helper'

export function onboardingCommunities(users) {
  return (
    <div className="Cards">
      {users.map((user, i) => {
        return <UserCard ref={'userCard_' + i} user={user} key={i} />
      })}
    </div>
  )
}

export function onboardingPeople(users) {
  return (
    <div className="Users as-grid">
      {users.map((user, i) => {
        return <UserGrid ref={'userGrid_' + i} user={user} key={i} />
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

export function postsAsList(posts, json, currentUser) {
  return (
    <div className="Posts as-list">
      {posts.map((post) => {
        return (
          <div ref={`postList_${post.id}`} key={post.id} className="PostList">
            {parsePost(post, json, currentUser)}
          </div>
        )
      })}
    </div>
  )
}

export function discoverUsers(users, json, currentUser) {
  const posts = getLinkArray(users[0], 'posts', json)
  return postsAsGrid(posts, json, currentUser)
}

export function userDetail(users, json, currentUser) {
  const user = users[0]
  const posts = getLinkArray(user, 'posts', json)
  return (
    <div className="UserDetail">
      <UserGrid ref={'userGrid_' + user.id} user={user} key={user.id} />
      {postsAsList(posts, json, currentUser)}
    </div>
  )
}

export function postDetail(posts, json, currentUser) {
  const post = posts[0]
  const comments = getLinkArray(post, 'comments', json) || []
  return (
    <div ref={`postList_${post.id}`} key={post.id} className="PostList">
      {parsePost(post, json, currentUser)}
      {comments.map((comment) => {
        return parsePost(comment, json, currentUser, false)
      })}
    </div>
  )
}

