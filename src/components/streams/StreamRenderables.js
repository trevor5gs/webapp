import React from 'react'
import { camelize } from 'humps'
import * as api from '../../networking/api'
import { getLinkArray } from '../base/json_helper'
import { parsePost } from '../parsers/PostParser'
import { parseComment } from '../parsers/CommentParser'
import { parseNotification } from '../parsers/NotificationParser'
import Cover from '../assets/Cover'
import PostsAsGrid from '../posts/PostsAsGrid'
import { BubbleIcon, HeartIcon, RepostIcon } from '../posts/PostIcons'
import UserAvatar from '../users/UserAvatar'
import UserAvatars from '../users/UserAvatars'
import UserCard from '../users/UserCard'
import UserGrid from '../users/UserGrid'
import UserInvitee from '../users/UserInvitee'
import UserList from '../users/UserList'
import Preference from '../../components/forms/Preference'
import TreeButton from '../../components/navigation/TreeButton'
import { preferenceToggleChanged } from '../../components/base/junk_drawer'

// TODO: convert these into react components (@see UserVitals)
// to hopefully get better errors out of rendering streams
export function usersAsCards(users) {
  return (
    <div className="Cards">
      {users.data.map((user, i) => {
        return <UserCard ref={ `userCard_${i}` } user={ user } key={ i } />
      })}
    </div>
  )
}

export function usersAsGrid(users) {
  return (
    <div className="Users asGrid">
      {users.data.map((user, i) => {
        return <UserGrid ref={ `userGrid_${i}` } user={ user } key={ i } />
      })}
    </div>
  )
}

export function usersAsList(users) {
  return (
    <div className="Users asList">
      {users.data.map((user, i) => {
        return <UserList ref={ `userList_${i}` } user={ user } key={ i } />
      })}
    </div>
  )
}

export function usersAsInviteeList(invitations, json) {
  return (
    <div className="Users asInviteeList">
      {invitations.data.map((invitation, i) => {
        return (
          <UserInvitee
            ref={ `userInvite${i}` }
            invitation={ invitation }
            json={ json }
            key={ i }
          />
        )
      })}
    </div>
  )
}

export function usersAsInviteeGrid(invitations, json) {
  return (
    <div className="Users asInviteeGrid">
      {invitations.data.map((invitation, i) => {
        return (
          <UserInvitee
            className="UserInviteeGrid"
            ref={ `userInvite${i}` }
            invitation={ invitation }
            json={ json }
            key={ i }
          />
        )
      })}
    </div>
  )
}

export function postsAsGrid(posts, json, currentUser, gridColumnCount) {
  return (
    <PostsAsGrid
      posts={posts.data}
      json={json}
      currentUser={currentUser}
      gridColumnCount={gridColumnCount}
    />
  )
}

export function postsAsList(posts, json, currentUser) {
  return (
    <div className="Posts asList">
      {posts.data.map((post) => {
        return (
          <article ref={ `postList_${post.id}` } key={ post.id } className="Post PostList">
            {parsePost(post, json, currentUser, false)}
          </article>
        )
      })}
    </div>
  )
}

export function userDetail(users, json, currentUser, gridColumnCount) {
  const user = users.data[0]
  let posts = getLinkArray(user, 'posts', json) || []
  posts = posts.concat(users.nestedData)
  return (
    <div className="UserDetails">
      <Cover coverImage={ user.coverImage } />
      <UserList
        classList="asUserDetailHeader"
        ref={ `UserList_${user.id}` }
        user={ user }
        key={ user.id }
        showBlockMuteButton
      />
      {gridColumnCount ?
        postsAsGrid({ data: posts, nestedData: [] }, json, currentUser, gridColumnCount) :
        postsAsList({ data: posts, nestedData: [] }, json, currentUser)
      }
    </div>
  )
}

export function userDetailAsGrid(users, json, currentUser, gridColumnCount) {
  return userDetail(users, json, currentUser, gridColumnCount)
}

export function userDetailAsList(users, json, currentUser) {
  return userDetail(users, json, currentUser)
}

export function postDetail(posts, json, currentUser) {
  const post = posts.data[0]
  let comments = getLinkArray(post, 'comments', json) || []
  comments = comments.concat(posts.nestedData)
  const avatarDrawers = []
  if (Number(post.lovesCount) > 0) {
    avatarDrawers.push(
      <UserAvatars
        endpoint={ api.postLovers(post) }
        icon={ <HeartIcon /> }
        key={ `lovers_${post.id}` }
        resultKey="lovers"
      />
    )
  }
  if (Number(post.repostsCount) > 0) {
    avatarDrawers.push(
      <UserAvatars
        endpoint={ api.postReposters(post) }
        icon={ <RepostIcon /> }
        key={ `reposters_${post.id}` }
        resultKey="reposters"
      />
    )
  }
  return (
    <div className="PostDetails Posts asList">
      <article ref={ `postList_${post.id}` } key={ post.id } className="Post PostList">
        {parsePost(post, json, currentUser, false)}
        {avatarDrawers}
        <section className="Comments">
          <BubbleIcon/>
          {comments.map((comment) => {
            return (
              <div ref={ `commentList_${comment.id}` } key={ comment.id } className="CommentList">
                {parseComment(comment, json, currentUser, false)}
              </div>
            )
          })}
        </section>
      </article>
    </div>
  )
}

export function notificationList(notifications, json, currentUser) {
  return (
    <div className="Notifications">
      {notifications.data.map((notification) => {
        return parseNotification(notification, json, currentUser)
      })}
    </div>
  )
}

export function userAvatars(users) {
  return (
    users.data.map((user) => {
      return <UserAvatar user={user} key={`userAvatar_${user.id}`}/>
    })
  )
}

export function profileToggles(categories, json, currentUser) {
  return (
    categories.data.map((category, index) => {
      if (category.label.toLowerCase().indexOf('push') === 0) { return null }
      const arr = [<TreeButton key={`categoryLabel${index}`}>{category.label}</TreeButton>]
      arr.push(
        <div className="TreePanel" key={`categoryItems${index}`}>
          {
            category.items.map((item) => {
              return (
                <Preference
                  definition={{ term: item.label, desc: item.info }}
                  id={ item.key }
                  key={ item.key }
                  isChecked={ currentUser[camelize(item.key)] }
                  isDisabled={ !currentUser.isPublic && item.key === 'has_sharing_enabled' }
                  onToggleChange={ preferenceToggleChanged }
                />
              )
            })
          }
        </div>
      )
      return arr
    })
  )
}

