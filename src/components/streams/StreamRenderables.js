import React from 'react'
import { uniqBy } from 'lodash'
import { camelize } from 'humps'
import { postLovers, postReposters } from '../../networking/api'
import { getLinkArray, getLinkObject } from '../base/json_helper'
import { USERS } from '../../constants/mapping_types'
import PostParser from '../parsers/PostParser'
import CommentParser from '../parsers/CommentParser'
import NotificationParser from '../parsers/NotificationParser'
import PostsAsGrid from '../posts/PostsAsGrid'
import { PostDetailHelmet } from '../helmets/PostDetailHelmet'
import { HeartIcon, RepostIcon } from '../posts/PostIcons'
import UserAvatar from '../users/UserAvatar'
import UserAvatars from '../users/UserAvatars'
import UserCard from '../users/UserCard'
import UserCompact from '../users/UserCompact'
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
      {users.data.map((user) =>
        <UserCard user={ user } key={ `userCard_${user.id}` } />
      )}
    </div>
  )
}

export function usersAsGrid(users) {
  return (
    <div className="Users asGrid">
      {users.data.map((user) =>
        <UserGrid user={ user } key={ `userGrid_${user.id}` } />
      )}
    </div>
  )
}

export function usersAsList(users) {
  return (
    <div className="Users asList">
      {users.data.map((user) =>
        <UserList user={ user } key={ `userList_${user.id}` } />
      )}
    </div>
  )
}

export function usersAsInviteeList(invitations, json) {
  return (
    <div className="Users asInviteeList">
      {invitations.data.map((invitation) =>
        <UserInvitee
          invitation={ invitation }
          json={ json }
          key={ `userInviteeList_${invitation.id}` }
        />
      )}
    </div>
  )
}

export function usersAsInviteeGrid(invitations, json) {
  return (
    <div className="Users asInviteeGrid">
      {invitations.data.map((invitation) =>
          <UserInvitee
            className="UserInviteeGrid"
            invitation={ invitation }
            json={ json }
            key={ `userInviteeGrid_${invitation.id}` }
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
        <article id={ `Post_${post.id}` } key={ `postsAsList_${post.id}` } className="PostList">
          <PostParser
            isGridLayout={ false }
            post={ post }
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
      key={ `userAvatarsLovers_${post.id}` }
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
      key={ `userAvatarsReposters_${post.id}` }
      post={ post }
      resultType="repost"
    />
  )
}

export function postDetail(posts, json) {
  const post = posts.data[0]
  const author = json[USERS][post.authorId]
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
      <PostDetailHelmet post={ post } author={ author } />
      <article id={ `Post_${post.id}` } key={ `postDetail_${post.id}` } className="PostList">
        <PostParser
          isGridLayout={ false }
          isPostDetail
          post={ post }
        />
        { avatarDrawers }
        <Editor post={ post } isComment/>
        <section className="Comments">
          {comments.map((comment) =>
            <div key={ `commentList_${comment.id}` } className="CommentList">
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
          key={ `commentParser_${comment.id}` }
          comment={ comment }
          isEditing={ comment.isEditing }
          isGridLayout={ false }
        />
      )}
    </div>
  )
}

export function notificationList(notifications, json) {
  return (
    <div className="Notifications">
      {notifications.data.map((notification) => {
        const subject = getLinkObject(notification, `subject`, json)
        return (
          <NotificationParser
            json={ json }
            key={ `notificationParser_${notification.createdAt}` }
            notification={ notification }
            subject={ subject }
          />
        )}
      )}
    </div>
  )
}

export function userAvatars(users) {
  const uniqUsers = uniqBy(users.data, (user) => user.id)
  return (
    uniqUsers.map((user) =>
      <UserAvatar user={user} key={`userAvatar_${user.id}`} />
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
                key={ `preference_${item.key}` }
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

export function blockedMutedUserList(users) {
  return (
    users.data.map((user) =>
      <UserCompact user={user} key={`userCompact_${user.id}`}/>
    )
  )
}

