import React from 'react'
import { camelize } from 'humps'
import { postLovers, postReposters } from '../../networking/api'
import { getLinkArray } from '../base/json_helper'
import PostParser from '../parsers/PostParser'
import CommentParser from '../parsers/CommentParser'
import { parseNotification } from '../parsers/NotificationParser'
import PostsAsGrid from '../posts/PostsAsGrid'
import { HeartIcon, RepostIcon } from '../posts/PostIcons'
import UserAvatar from '../users/UserAvatar'
import UserAvatars from '../users/UserAvatars'
import UserCard from '../users/UserCard'
import UserGrid from '../users/UserGrid'
import UserInvitee from '../users/UserInvitee'
import UserList from '../users/UserList'
import Editor from '../../components/editor/Editor'
import Preference from '../../components/forms/Preference'
import TreeButton from '../../components/navigation/TreeButton'
import TreePanel from '../../components/navigation/TreePanel'
import { preferenceToggleChanged } from '../../components/base/junk_drawer'

// TODO: convert these into react components (@see UserVitals)
// to hopefully get better errors out of rendering streams
export function usersAsCards(users) {
  return (
    <div className="Cards">
      {users.data.map((user, i) =>
        <UserCard ref={ `userCard_${i}` } user={ user } key={ i } />
      )}
    </div>
  )
}

export function usersAsGrid(users) {
  return (
    <div className="Users asGrid">
      {users.data.map((user, i) =>
        <UserGrid ref={ `userGrid_${i}` } user={ user } key={ i } />
      )}
    </div>
  )
}

export function usersAsList(users) {
  return (
    <div className="Users asList">
      {users.data.map((user, i) =>
        <UserList ref={ `userList_${i}` } user={ user } key={ i } />
      )}
    </div>
  )
}

export function usersAsInviteeList(invitations, json) {
  return (
    <div className="Users asInviteeList">
      {invitations.data.map((invitation, i) =>
        <UserInvitee
          ref={ `userInvite${i}` }
          invitation={ invitation }
          json={ json }
          key={ i }
        />
      )}
    </div>
  )
}

export function usersAsInviteeGrid(invitations, json) {
  return (
    <div className="Users asInviteeGrid">
      {invitations.data.map((invitation, i) =>
          <UserInvitee
            className="UserInviteeGrid"
            ref={ `userInvite${i}` }
            invitation={ invitation }
            json={ json }
            key={ i }
          />
      )}
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

export function postsAsList(posts) {
  return (
    <div className="Posts asList">
      {posts.data.map((post) =>
        <article ref={ `postList_${post.id}` } key={ post.id } className="Post PostList">
          <PostParser
            post={ post }
            isEditing={ post.isEditing }
            isGridLayout={ false }
            isReposting={ post.isReposting }
            showComments={ post.showComments }
            showLovers={ post.showLovers }
            showReposters={ post.showReposters }
          />
        </article>
      )}
    </div>
  )
}

export function postLoversDrawer(post) {
  return (
    <UserAvatars
      endpoint={ postLovers(post) }
      icon={ <HeartIcon /> }
      key={ `lovers_${post.id}` }
      post={ post }
      resultType="love"
    />
  )
}

export function postRepostersDrawer(post) {
  return (
    <UserAvatars
      endpoint={ postReposters(post) }
      icon={ <RepostIcon /> }
      key={ `reposters_${post.id}` }
      post={ post }
      resultType="repost"
    />
  )
}

export function postDetail(posts, json) {
  const post = posts.data[0]
  let comments = getLinkArray(post, 'comments', json) || []
  comments = comments.concat(posts.nestedData)
  const avatarDrawers = []
  if (Number(post.lovesCount) > 0) {
    avatarDrawers.push(postLoversDrawer(post))
  }
  if (Number(post.repostsCount) > 0) {
    avatarDrawers.push(postRepostersDrawer(post))
  }
  return (
    <div className="PostDetails Posts asList">
      <article ref={ `postList_${post.id}` } key={ post.id } className="Post PostList" >
        <PostParser
          post={ post }
          isEditing={ post.isEditing }
          isGridLayout={ false }
          isReposting={ post.isReposting }
        />
        { avatarDrawers }
        <Editor post={ post } isComment/>
        <section className="Comments">
          {comments.map((comment) =>
            <div ref={ `commentList_${comment.id}` } key={ comment.id } className="CommentList">
              <CommentParser
                comment={ comment }
                isEditing={ comment.isEditing }
                isGridLayout={ false }
                post={ post }
              />
            </div>
          )}
        </section>
      </article>
    </div>
  )
}

export function commentsAsList(comments) {
  return (
    <div>
      {comments.data.map(comment =>
        <CommentParser
          key={ `CommentParser_${comment.id}` }
          comment={ comment }
          isEditing={ comment.isEditing }
          isGridLayout={ false }
        />
      )}
    </div>
  )
}

export function notificationList(notifications, json, currentUser) {
  return (
    <div className="Notifications">
      {notifications.data.map((notification) =>
        parseNotification(notification, json, currentUser)
      )}
    </div>
  )
}

export function userAvatars(users) {
  return (
    users.data.map((user) =>
      <UserAvatar user={user} key={`userAvatar_${user.id}`}/>
    )
  )
}

export function profileToggles(categories, json, currentUser) {
  return (
    categories.data.map((category, index) => {
      if (category.label.toLowerCase().indexOf('push') === 0) { return null }
      const arr = [<TreeButton key={`categoryLabel${index}`}>{category.label}</TreeButton>]
      arr.push(
        <TreePanel key={`categoryItems${index}`}>
          {
            category.items.map((item) =>
              <Preference
                definition={{ term: item.label, desc: item.info }}
                id={ item.key }
                key={ item.key }
                isChecked={ currentUser[camelize(item.key)] }
                isDisabled={ !currentUser.isPublic && item.key === 'has_sharing_enabled' }
                onToggleChange={ preferenceToggleChanged }
              />
            )
          }
        </TreePanel>
      )
      return arr
    })
  )
}

