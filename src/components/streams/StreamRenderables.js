import React from 'react'
import { Link } from 'react-router'
import { get, uniqBy } from 'lodash'
import { preferenceToggleChanged } from '../../helpers/junk_drawer'
import PostParser from '../parsers/PostParser'
import CommentParser from '../parsers/CommentParser'
import NotificationParser from '../parsers/NotificationParser'
import PostsAsGrid from '../posts/PostsAsGrid'
import UserAvatar from '../users/UserAvatar'
import UserCard from '../users/UserCard'
import UserCompact from '../users/UserCompact'
import UserGrid from '../users/UserGrid'
import UserInvitee from '../users/UserInvitee'
import UserList from '../users/UserList'
import Preference from '../../components/forms/Preference'
import TreeButton from '../../components/navigation/TreeButton'
import TreePanel from '../../components/navigation/TreePanel'
import { isElloAndroid } from '../../vendor/jello'

export function categoriesAsGrid(categories) {
  return (
    <div className="Categories asGrid">
      {categories.data.map((category, index) =>
        <Link
          className="CategoryLink"
          to={`/discover/${category.slug}`}
          key={`CategoryLink_${category.slug}_${index}`}
          style={{ backgroundImage: `url("${get(category, 'tileImage.large.url')}")` }}
        >
          <span className="CategoryLinkName">{category.name}</span>
        </Link>
      )}
    </div>
  )
}

// TODO: convert these into react components (@see UserVitals)
// to hopefully get better errors out of rendering streams
export function usersAsCards(users) {
  return (
    <div className="Cards">
      {users.data.map((user) =>
        <UserCard user={user} key={`userCard_${user.id}`} />
      )}
    </div>
  )
}

export function usersAsGrid(users) {
  return (
    <div className="Users asGrid">
      {users.data.map((user) =>
        <UserGrid user={user} key={`userGrid_${user.id}`} />
      )}
    </div>
  )
}

export function usersAsList(users) {
  return (
    <div className="Users asList">
      {users.data.map((user) =>
        <UserList user={user} key={`userList_${user.id}`} />
      )}
    </div>
  )
}

export function usersAsInviteeList(invitations) {
  return (
    <div className="Users asInviteeList">
      {invitations.data.map((invitation) =>
        <UserInvitee
          invitation={invitation}
          key={`userInviteeList_${invitation.id}`}
        />
      )}
    </div>
  )
}

export function usersAsInviteeGrid(invitations) {
  return (
    <div className="Users asInviteeGrid">
      {invitations.data.map((invitation) =>
        <UserInvitee
          className="UserInviteeGrid"
          invitation={invitation}
          key={`userInviteeGrid_${invitation.id}`}
        />
      )}
    </div>
  )
}

export function postsAsGrid(posts) {
  return (
    <PostsAsGrid posts={posts.data} />
  )
}

export function postsAsList(posts) {
  return (
    <div className="Posts asList">
      {posts.data.map((post) =>
        <article id={`Post_${post.id}`} key={`postsAsList_${post.id}`} className="PostList">
          <PostParser
            isGridLayout={false}
            post={post}
          />
        </article>
      )}
    </div>
  )
}

export function commentsAsList(post) {
  return comments => (
    <div>
      {comments.data.map(comment =>
        <CommentParser
          key={`commentParser_${comment.id}`}
          comment={comment}
          post={post}
          isEditing={comment.isEditing}
        />
      )}
    </div>
  )
}

export function notificationList(notifications) {
  return (
    <div className="Notifications">
      {notifications.data.map((notification, index) =>
        <NotificationParser
          key={`notificationParser${index}_${notification ? notification.createdAt : Date.now()}`}
          notification={notification}
        />
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

export function profileToggles(settings) {
  return (
    settings.data.map((setting, index) => {
      if (!isElloAndroid() && setting.label.toLowerCase().indexOf('push') === 0) { return null }
      const arr = [<TreeButton key={`settingLabel${index}`}>{setting.label}</TreeButton>]
      arr.push(
        <TreePanel key={`settingItems${index}`}>
          {
            setting.items.map((item) =>
              <Preference
                definition={{ term: item.label, desc: item.info }}
                id={item.key}
                key={`preference_${item.key}`}
                onToggleChange={preferenceToggleChanged}
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
      <UserCompact user={user} key={`userCompact_${user.id}`} />
    )
  )
}

