import React from 'react'
import { Link } from 'react-router'
import Avatar from '../users/Avatar'
import { getLinkObject } from '../base/json_helper'
import * as MAPPING_TYPES from '../../constants/mapping_types'
import { parseSummary } from './PostParser'

const NOTIFICATION_KIND = {
  COMMENT: 'comment_notification',
  COMMENT_MENTION: 'comment_mention_notification',
  COMMENT_ORIGINAL: 'comment_on_original_post_notification',
  COMMENT_REPOST: 'comment_on_repost_notification',
  INVITATION_ACCEPTED: 'invitation_accepted_post',
  LOVE: 'love_notification',
  LOVE_ORIGINAL: 'love_on_original_post_notification',
  LOVE_REPOST: 'love_on_repost_notification',
  NEW_FOLLOWED_USER: 'new_followed_user_post',
  NEW_FOLLOWER: 'new_follower_post',
  POST_MENTION: 'post_mention_notification',
  REPOST: 'repost_notification',
  WELCOME: 'welcome_notification',
}

let models = {}

// HELPERS
function userTextLink(user) {
  if (!user) { return null }
  return (
    <Link to={`/${user.username}`}>
      {`@${user.username}`}
    </Link>
  )
}

function postTextLink(post, text = 'post') {
  if (!post) { return null }
  const author = models[MAPPING_TYPES.USERS][post.authorId]
  return (
    <Link to={`/${author.username}/post/${post.token}`}>
      {text}
    </Link>
  )
}

function timestamp(createdAt) {
  return (
    <div>{new Date(createdAt).timeAgoInWords()}</div>
  )
}

// COMMENTS
function commentNotification(comment, createdAt) {
  // TODO: investigate why these are undefined sometimes
  if (!comment) { return null }
  const author = getLinkObject(comment, 'author', models)
  const parentPost = getLinkObject(comment, 'parentPost', models)
  if (!author || !parentPost) { return null }
  return (
    <div key={`commentNotification_${comment.id}`}>
      <Avatar imgSrc={author.avatar.regular.url} path={`/${author.username}`} />
      {userTextLink(author)}
      {` commented on your `}
      {postTextLink(parentPost)}
      .
      {parseSummary(parentPost, models, 'text')}
      {timestamp(createdAt)}
    </div>
  )
}

function commentMentionNotification(comment, createdAt) {
  if (!comment) { return null }
  const author = getLinkObject(comment, 'author', models)
  const parentPost = getLinkObject(comment, 'parentPost', models)
  if (!author || !parentPost) { return null }
  return (
    <div key={`commentMentionNotification_${comment.id}`}>
      <Avatar imgSrc={author.avatar.regular.url} path={`/${author.username}`} />
      {userTextLink(author)}
      {` mentioned you in a `}
      {postTextLink(parentPost, 'comment')}
      .
      {parseSummary(parentPost, models, 'text')}
      {timestamp(createdAt)}
    </div>
  )
}

function commentOnOriginalPostNotification(comment, createdAt) {
  if (!comment) { return null }
  const author = getLinkObject(comment, 'author', models)
  const repost = getLinkObject(comment, 'parentPost', models)
  const repostAuthor = getLinkObject(repost, 'author', models)
  const repostedSource = getLinkObject(repost, 'repostedSource', models)
  if (!author || !repost || !repostAuthor || !repostedSource) { return null }
  return (
    <div key={`commentOnOriginalPostNotification_${comment.id}`}>
      <Avatar imgSrc={author.avatar.regular.url} path={`/${author.username}`} />
      {userTextLink(author)}
      {` commented on `}
      {userTextLink(repostAuthor)}
      {`'s `}
      {postTextLink(repost, 'repost')}
      {` of your `}
      {postTextLink(repostedSource)}
      .
      {parseSummary(repost, models, 'text')}
      {timestamp(createdAt)}
    </div>
  )
}

function commentOnRepostNotification(comment, createdAt) {
  if (!comment) { return null }
  const author = getLinkObject(comment, 'author', models)
  const repost = getLinkObject(comment, 'parentPost', models)
  if (!author || !repost) { return null }
  return (
    <div key={`commentOnRepostNotification_${comment.id}`}>
      <Avatar imgSrc={author.avatar.regular.url} path={`/${author.username}`} />
      {userTextLink(author)}
      {` commented on your `}
      {postTextLink(repost, 'repost')}
      .
      {parseSummary(repost, models, 'text')}
      {timestamp(createdAt)}
    </div>
  )
}

// INVITATIONS
function invitationAcceptedNotification(user, createdAt) {
  if (!user) { return null }
  return (
    <div key={`invitationAcceptedNotification_${user.id}`}>
      <Avatar imgSrc={user.avatar.regular.url} path={`/${user.username}`} />
      {userTextLink(user)}
      {` accepted your invitation.`}
      {timestamp(createdAt)}
    </div>
  )
}

// LOVES
function loveNotification(love, createdAt) {
  if (!love) { return null }
  const user = getLinkObject(love, 'user', models)
  const post = getLinkObject(love, 'post', models)
  if (!user || !post) { return null }
  return (
    <div key={`loveNotification_${user.id}_${post.id}`}>
      <Avatar imgSrc={user.avatar.regular.url} path={`/${user.username}`} />
      {userTextLink(user)}
      {` loved your `}
      {postTextLink(post)}
      .
      {timestamp(createdAt)}
    </div>
  )
}

function loveOnRepostNotification(love, createdAt) {
  if (!love) { return null }
  const user = getLinkObject(love, 'user', models)
  const repost = getLinkObject(love, 'post', models)
  if (!user || !repost) { return null }
  return (
    <div key={`loveOnRepostNotification_${user.id}_${repost.id}`}>
      <Avatar imgSrc={user.avatar.regular.url} path={`/${user.username}`} />
      {userTextLink(user)}
      {` loved your `}
      {postTextLink(repost, 'repost')}
      .
      {timestamp(createdAt)}
    </div>
  )
}

function loveOnOriginalPostNotification(love, createdAt) {
  if (!love) { return null }
  const user = getLinkObject(love, 'user', models)
  const repost = getLinkObject(love, 'post', models)
  const repostAuthor = getLinkObject(repost, 'author', models)
  const repostedSource = getLinkObject(repost, 'repostedSource', models)
  if (!user || !repost || !repostAuthor || !repostedSource) { return null }
  return (
    <div key={`loveOnOriginalPostNotification_${user.id}_${repost.id}`}>
      <Avatar imgSrc={user.avatar.regular.url} path={`/${user.username}`} />
      {userTextLink(user)}
      {` loved `}
      {userTextLink(repostAuthor)}
      {`'s `}
      {postTextLink(repost, 'repost')}
      {` of your `}
      {postTextLink(repostedSource)}
      .
      {timestamp(createdAt)}
    </div>
  )
}

// MENTIONS
function postMentionNotification(post, createdAt) {
  if (!post) { return null }
  const author = getLinkObject(post, 'author', models)
  if (!author) { return null }
  return (
    <div key={`postMentionNotification_${post.id}`}>
      <Avatar imgSrc={author.avatar.regular.url} path={`/${author.username}`} />
      {userTextLink(author)}
      {` mentioned you in a `}
      {postTextLink(post)}
      .
      {parseSummary(post, models, 'text')}
      {timestamp(createdAt)}
    </div>
  )
}

// RELATIONSHIPS
function newFollowerPost(user, createdAt) {
  if (!user) { return null }
  return (
    <div key={`newFollowerPost_${user.id}`}>
      <Avatar imgSrc={user.avatar.regular.url} path={`/${user.username}`} />
      {userTextLink(user)}
      {` started following you.`}
      {timestamp(createdAt)}
    </div>
  )
}

function newFollowedUserPost(user, createdAt) {
  if (!user) { return null }
  return (
    <div key={`newFollowedUserPost_${user.id}`}>
      <Avatar imgSrc={user.avatar.regular.url} path={`/${user.username}`} />
      {`You started following `}
      {userTextLink(user)}
      .
      {timestamp(createdAt)}
    </div>
  )
}

// REPOSTS
function repostNotification(post, createdAt) {
  if (!post) { return null }
  const author = getLinkObject(post, 'author', models)
  if (!author) { return null }
  return (
    <div key={`repostNotification_${post.id}`}>
      <Avatar imgSrc={author.avatar.regular.url} path={`/${author.username}`} />
      {userTextLink(author)}
      {` reposted your `}
      {postTextLink(post)}
      .
      {parseSummary(post, models, 'text')}
      {timestamp(createdAt)}
    </div>
  )
}

export function parseNotification(notification, json) {
  // TODO: investigate why the notification is sometimes undefined
  if (!notification) { return null }
  models = json
  const cells = []
  const createdAt = notification.createdAt
  const subject = getLinkObject(notification, `subject`, json)
  switch (notification.kind) {
  case NOTIFICATION_KIND.COMMENT:
    cells.push(commentNotification(subject, createdAt))
    break
  case NOTIFICATION_KIND.COMMENT_MENTION:
    cells.push(commentMentionNotification(subject, createdAt))
    break
  case NOTIFICATION_KIND.COMMENT_ORIGINAL:
    cells.push(commentOnOriginalPostNotification(subject, createdAt))
    break
  case NOTIFICATION_KIND.COMMENT_REPOST:
    cells.push(commentOnRepostNotification(subject, createdAt))
    break
  case NOTIFICATION_KIND.INVITATION_ACCEPTED:
    cells.push(invitationAcceptedNotification(subject, createdAt))
    break
  case NOTIFICATION_KIND.LOVE:
    cells.push(loveNotification(subject, createdAt))
    break
  case NOTIFICATION_KIND.LOVE_ORIGINAL:
    cells.push(loveOnOriginalPostNotification(subject, createdAt))
    break
  case NOTIFICATION_KIND.LOVE_REPOST:
    cells.push(loveOnRepostNotification(subject, createdAt))
    break
  case NOTIFICATION_KIND.NEW_FOLLOWER:
    cells.push(newFollowerPost(subject, createdAt))
    break
  case NOTIFICATION_KIND.NEW_FOLLOWED_USER:
    cells.push(newFollowedUserPost(subject, createdAt))
    break
  case NOTIFICATION_KIND.POST_MENTION:
    cells.push(postMentionNotification(subject, createdAt))
    break
  case NOTIFICATION_KIND.REPOST:
    cells.push(repostNotification(subject, createdAt))
    break
  case NOTIFICATION_KIND.WELCOME:
    return <div>Welcome to Ello!</div>
  default:
    return null
  }
  return cells
}

