import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'
import { getLinkObject } from '../base/json_helper'
import * as MAPPING_TYPES from '../../constants/mapping_types'
import { regionItemsForNotifications, setModels } from '../parsers/RegionParser'
import RelationsGroup from '../relationships/RelationsGroup'
import { Notification } from '../notifications/Notification'

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
function getActivityPath(user, post) {
  if (!post) { return `/${user.username}` }
  return `/${user.username}/post/${post.token}`
}

function userTextLink(user) {
  if (!user) { return null }
  return (
    <Link to={ getActivityPath(user) }>
      {`@${user.username}`}
    </Link>
  )
}

function postTextLink(post, text = 'post') {
  if (!post) { return null }
  const author = models[MAPPING_TYPES.USERS][post.authorId]
  if (!author) { return null }
  return (
    <Link to={ getActivityPath(author, post) }>
      { text }
    </Link>
  )
}

function parseSummary(post, path) {
  return regionItemsForNotifications(post.summary, path)
}


// COMMENTS
function commentNotification(comment, createdAt) {
  const author = getLinkObject(comment, 'author', models)
  const parentPost = getLinkObject(comment, 'parentPost', models)
  if (!author || !parentPost) { return null }
  const activityPath = getActivityPath(author, parentPost)
  const summary = parseSummary(comment, activityPath)
  return (
    <Notification
      activityPath={ activityPath }
      className="CommentNotification"
      createdAt={ createdAt }
      notifier={ author }
      summary={ summary }
    >
      <p>
        { userTextLink(author) }
        { ' commented on your ' }
        { postTextLink(parentPost) }
        { '.' }
      </p>
    </Notification>
  )
}

function commentMentionNotification(comment, createdAt) {
  const author = getLinkObject(comment, 'author', models)
  const parentPost = getLinkObject(comment, 'parentPost', models)
  if (!author || !parentPost) { return null }
  const activityPath = getActivityPath(author, parentPost)
  const summary = parseSummary(comment, activityPath)
  return (
    <Notification
      activityPath={ activityPath }
      className="CommentMentionNotification"
      createdAt={ createdAt }
      notifier={ author }
      summary={ summary }
    >
      <p>
        { userTextLink(author) }
        { ' mentioned you in a ' }
        { postTextLink(parentPost, 'comment') }
        { '.' }
      </p>
    </Notification>
  )
}

function commentOnOriginalPostNotification(comment, createdAt) {
  const author = getLinkObject(comment, 'author', models)
  const repost = getLinkObject(comment, 'parentPost', models)
  const repostAuthor = getLinkObject(repost, 'author', models)
  const repostedSource = getLinkObject(repost, 'repostedSource', models)
  if (!author || !repost || !repostAuthor || !repostedSource) { return null }
  const activityPath = getActivityPath(author, repostedSource)
  const summary = parseSummary(comment, activityPath)
  return (
    <Notification
      activityPath={ activityPath }
      className="CommentOnPostNotification"
      createdAt={ createdAt }
      notifier={ author }
      summary={ summary }
    >
      <p>
        { userTextLink(author) }
        { ' commented on ' }
        { userTextLink(repostAuthor) }
        {'\'s '}
        { postTextLink(repost, 'repost') }
        {' of your '}
        { postTextLink(repostedSource) }
        { '.' }
      </p>
    </Notification>
  )
}

function commentOnRepostNotification(comment, createdAt) {
  const author = getLinkObject(comment, 'author', models)
  const repost = getLinkObject(comment, 'parentPost', models)
  if (!author || !repost) { return null }
  const activityPath = getActivityPath(author, repost)
  const summary = parseSummary(comment, activityPath)
  return (
    <Notification
      activityPath={ activityPath }
      className="CommentOnRepostNotification"
      createdAt={ createdAt }
      notifier={ author }
      summary={ summary }
    >
      <p>
        { userTextLink(author) }
        { ' commented on your ' }
        { postTextLink(repost, 'repost') }
        { '.' }
      </p>
    </Notification>
  )
}

// INVITATIONS
function invitationAcceptedNotification(user, createdAt) {
  return (
    <Notification
      activityPath={ getActivityPath(user) }
      className="InvitationAcceptedNotification"
      createdAt={ createdAt }
      notifier={ user }
    >
      <p>
        { userTextLink(user) }
        { ' accepted your invitation.' }
      </p>
    </Notification>
  )
}

// LOVES
function loveNotification(love, createdAt) {
  const user = getLinkObject(love, 'user', models)
  const post = getLinkObject(love, 'post', models)
  if (!user || !post) { return null }
  const activityPath = getActivityPath(user, post)
  const summary = parseSummary(post, activityPath)
  return (
    <Notification
      activityPath={ activityPath }
      className="LoveNotification"
      createdAt={ createdAt }
      notifier={ user }
      summary={ summary }
    >
      <p>
        { userTextLink(user) }
        { ' loved your ' }
        { postTextLink(post) }
        { '.' }
      </p>
    </Notification>
  )
}

function loveOnRepostNotification(love, createdAt) {
  const user = getLinkObject(love, 'user', models)
  const repost = getLinkObject(love, 'post', models)
  if (!user || !repost) { return null }
  const activityPath = getActivityPath(user, repost)
  const summary = parseSummary(repost, activityPath)
  return (
    <Notification
      activityPath={ activityPath }
      className="LoveOnRepostNotification"
      createdAt={ createdAt }
      notifier={ user }
      summary={ summary }
    >
      <p>
        { userTextLink(user) }
        { ' loved your ' }
        { postTextLink(repost, 'repost') }
        { '.' }
      </p>
    </Notification>
  )
}

function loveOnOriginalPostNotification(love, createdAt) {
  const user = getLinkObject(love, 'user', models)
  const repost = getLinkObject(love, 'post', models)
  const repostAuthor = getLinkObject(repost, 'author', models)
  const repostedSource = getLinkObject(repost, 'repostedSource', models)
  if (!user || !repost || !repostAuthor || !repostedSource) { return null }
  const activityPath = getActivityPath(user, repost)
  const summary = parseSummary(repost, activityPath)
  return (
    <Notification
      activityPath={ activityPath }
      className="LoveOnOriginalPostNotification"
      createdAt={ createdAt }
      notifier={ user }
      summary={ summary }
    >
      <p>
        {userTextLink(user)}
        {' loved '}
        {userTextLink(repostAuthor)}
        {'\'s '}
        {postTextLink(repost, 'repost')}
        {' of your '}
        {postTextLink(repostedSource)}
        { '.' }
      </p>
    </Notification>
  )
}

// MENTIONS
function postMentionNotification(post, createdAt) {
  const author = getLinkObject(post, 'author', models)
  if (!author) { return null }
  const activityPath = getActivityPath(author, post)
  const summary = parseSummary(post, activityPath)
  return (
    <Notification
      activityPath={ activityPath }
      className="PostMentionNotification"
      createdAt={ createdAt }
      notifier={ author }
      summary={ summary }
    >
      <p>
        { userTextLink(author) }
        { ' mentioned you in a ' }
        { postTextLink(post) }
        { '.' }
      </p>
    </Notification>
  )
}

// RELATIONSHIPS
function newFollowerPost(user, createdAt) {
  return (
    <Notification
      activityPath={ getActivityPath(user) }
      className="NewFollowerPostNotification"
      createdAt={ createdAt }
      notifier={ user }
      retort={ <RelationsGroup user={ user } /> }
    >
      <p>
        { userTextLink(user) }
        { ' started following you.' }
      </p>
    </Notification>
  )
}

function newFollowedUserPost(user, createdAt) {
  return (
    <Notification
      activityPath={ getActivityPath(user) }
      className="NewFollowedUserPostNotification"
      createdAt={ createdAt }
      notifier={ user }
    >
      <p>
        { 'You started following ' }
        { userTextLink(user) }
        { '.' }
      </p>
    </Notification>
  )
}

// REPOSTS
function repostNotification(post, createdAt) {
  const author = getLinkObject(post, 'author', models)
  if (!author) { return null }
  const activityPath = getActivityPath(author, post)
  const summary = parseSummary(post, activityPath)
  return (
    <Notification
      activityPath={ activityPath }
      className="RepostNotification"
      createdAt={ createdAt }
      notifier={ author }
      summary={ summary }
    >
      <p>
        { userTextLink(author) }
        { ' reposted your '}
        { postTextLink(post) }
        { '.' }
      </p>
    </Notification>
  )
}

class NotificationParser extends Component {
  static propTypes = {
    notification: PropTypes.object,
    json: PropTypes.object,
    subject: PropTypes.object.isRequired,
  }

  render() {
    const { notification, json, subject } = this.props
    if (!notification) { return null }
    models = json
    setModels(models)
    const createdAt = notification.createdAt

    switch (notification.kind) {
      case NOTIFICATION_KIND.COMMENT:
        return commentNotification(subject, createdAt)
      case NOTIFICATION_KIND.COMMENT_MENTION:
        return commentMentionNotification(subject, createdAt)
      case NOTIFICATION_KIND.COMMENT_ORIGINAL:
        return commentOnOriginalPostNotification(subject, createdAt)
      case NOTIFICATION_KIND.COMMENT_REPOST:
        return commentOnRepostNotification(subject, createdAt)
      case NOTIFICATION_KIND.INVITATION_ACCEPTED:
        return invitationAcceptedNotification(subject, createdAt)
      case NOTIFICATION_KIND.LOVE:
        return loveNotification(subject, createdAt)
      case NOTIFICATION_KIND.LOVE_ORIGINAL:
        return loveOnOriginalPostNotification(subject, createdAt)
      case NOTIFICATION_KIND.LOVE_REPOST:
        return loveOnRepostNotification(subject, createdAt)
      case NOTIFICATION_KIND.NEW_FOLLOWER:
        return newFollowerPost(subject, createdAt)
      case NOTIFICATION_KIND.NEW_FOLLOWED_USER:
        return newFollowedUserPost(subject, createdAt)
      case NOTIFICATION_KIND.POST_MENTION:
        return postMentionNotification(subject, createdAt)
      case NOTIFICATION_KIND.REPOST:
        return repostNotification(subject, createdAt)
      case NOTIFICATION_KIND.WELCOME:
        return <p>Welcome to Ello!</p>
      default:
        return null
    }
  }
}

export default NotificationParser

