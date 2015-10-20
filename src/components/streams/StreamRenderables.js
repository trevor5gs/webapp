import React from 'react'
import UserCard from '../users/UserCard'
import UserGrid from '../users/UserGrid'
import { parsePost } from '../posts/PostParser'
import { getLinkArray } from '../base/json_helper'

export function onboardingCommunities(users) {
  return (
    <div className="Cards">
      {users.data.map((user, i) => {
        return <UserCard ref={'userCard_' + i} user={user} key={i} />
      })}
    </div>
  )
}

export function onboardingPeople(users) {
  return (
    <div className="Users as-grid">
      {users.data.map((user, i) => {
        return <UserGrid ref={'userGrid_' + i} user={user} key={i} />
      })}
    </div>
  )
}

export function postsAsGrid(posts, json, currentUser) {
  return (
    <div className="Posts as-grid">
      {posts.data.map((post) => {
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
      {posts.data.map((post) => {
        return (
          <div ref={`postList_${post.id}`} key={post.id} className="PostList">
            {parsePost(post, json, currentUser)}
          </div>
        )
      })}
    </div>
  )
}

export function userDetail(users, json, currentUser) {
  const user = users.data[0]
  let posts = getLinkArray(user, 'posts', json) || []
  posts = posts.concat(users.nestedData)
  return (
    <div className="UserDetail">
      <UserGrid ref={'userGrid_' + user.id} user={user} key={user.id} />
      {postsAsList({data: posts, nestedData: []}, json, currentUser)}
    </div>
  )
}

export function postDetail(posts, json, currentUser) {
  const post = posts.data[0]
  let comments = getLinkArray(post, 'comments', json) || []
  comments = comments.concat(posts.nestedData)
  return (
    <div className="PostDetail">
      <div ref={`postList_${post.id}`} key={post.id} className="PostList">
        {parsePost(post, json, currentUser)}
      </div>
      {comments.map((comment) => {
        return (
          <div ref={`commentList_${comment.id}`} key={comment.id} className="CommentList">
            {parsePost(comment, json, currentUser, false)}
          </div>
        )
      })}
    </div>
  )
}

