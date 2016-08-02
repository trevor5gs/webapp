import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { getLinkObject } from '../helpers/json_helper'

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

const SUBJECT_TYPE = {
  LOVE: 'love',
  POST: 'post',
  USER: 'user',
}

function shouldContainerUpdate(thisProps, nextProps) {
  return true
}

class NotificationParser extends Component {
  static propTypes = {
    assets: PropTypes.object,
    createdAt: PropTypes.string.isRequired,
    kind: PropTypes.string,
    lovePost: PropTypes.object,
    lovePostAuthor: PropTypes.object,
    loveUser: PropTypes.object,
    parentPost: PropTypes.object,
    parentPostAuthor: PropTypes.object,
    postAuthor: PropTypes.object,
    repost: PropTypes.object,
    repostAuthor: PropTypes.object,
    repostedSource: PropTypes.object,
    repostedSourceAuthor: PropTypes.object,
    subject: PropTypes.object.isRequired,
  }

  shouldComponentUpdate(nextProps) {
    return shouldContainerUpdate(this.props, nextProps)
  }

  render() {
    const {
      createdAt,
      kind,
      lovePost,
      lovePostAuthor,
      loveUser,
      parentPost,
      parentPostAuthor,
      postAuthor,
      repost,
      repostAuthor,
      repostedSource,
      repostedSourceAuthor,
      subject,
    } = this.props

    let linkedObjects = {}
    switch (kind) {
      case NOTIFICATION_KIND.COMMENT:
        linkedObjects = { author: postAuthor, parentPost, parentPostAuthor }
        return commentNotification(subject, createdAt, linkedObjects)
      case NOTIFICATION_KIND.COMMENT_MENTION:
        linkedObjects = { author: postAuthor, parentPost, parentPostAuthor }
        return commentMentionNotification(subject, createdAt, linkedObjects)
      case NOTIFICATION_KIND.COMMENT_ORIGINAL:
        linkedObjects = {
          author: postAuthor,
          repost,
          repostAuthor,
          repostedSource,
          repostedSourceAuthor,
        }
        return commentOnOriginalPostNotification(subject, createdAt, linkedObjects)
      case NOTIFICATION_KIND.COMMENT_REPOST:
        linkedObjects = { author: postAuthor, repost, repostAuthor }
        return commentOnRepostNotification(subject, createdAt, linkedObjects)
      case NOTIFICATION_KIND.INVITATION_ACCEPTED:
        return invitationAcceptedNotification(subject, createdAt)
      case NOTIFICATION_KIND.LOVE:
        linkedObjects = { author: lovePostAuthor, post: lovePost, user: loveUser }
        return loveNotification(subject, createdAt, linkedObjects)
      case NOTIFICATION_KIND.LOVE_ORIGINAL:
        linkedObjects = {
          repost,
          repostAuthor,
          repostedSource,
          repostedSourceAuthor,
          user: loveUser,
        }
        return loveOnOriginalPostNotification(subject, createdAt, linkedObjects)
      case NOTIFICATION_KIND.LOVE_REPOST:
        linkedObjects = { repost, repostAuthor, user: loveUser }
        return loveOnRepostNotification(subject, createdAt, linkedObjects)
      case NOTIFICATION_KIND.NEW_FOLLOWER:
        return newFollowerPost(subject, createdAt)
      case NOTIFICATION_KIND.NEW_FOLLOWED_USER:
        return newFollowedUserPost(subject, createdAt)
      case NOTIFICATION_KIND.POST_MENTION:
        linkedObjects = { author: postAuthor }
        return postMentionNotification(subject, createdAt, linkedObjects)
      case NOTIFICATION_KIND.REPOST:
        linkedObjects = { author: postAuthor }
        return repostNotification(subject, createdAt, linkedObjects)
      case NOTIFICATION_KIND.WELCOME:
        return <p>Welcome to Ello!</p>
      default:
        return null
    }
  }
}

function mapStateToProps(state, ownProps) {
  const { notification } = ownProps
  const subject = getLinkObject(notification, 'subject', state.json)

  let lovePost = null
  let lovePostAuthor = null
  let loveUser = null
  let postAuthor = null
  let repost = null
  let repostAuthor = null
  let repostedSource = null
  let repostedSourceAuthor = null
  let parentPost = null
  let parentPostAuthor = null

  // subject is a post or comment
  if (notification.subjectType.toLowerCase() === SUBJECT_TYPE.POST) {
    postAuthor = getLinkObject(subject, 'author', state.json)
    // comment
    if (subject.postId) {
      parentPost = getLinkObject(subject, 'parentPost', state.json)
      parentPostAuthor = getLinkObject(parentPost, 'author', state.json)
    }
    // repost
    if (parentPost && parentPost.repostId) {
      repost = parentPost
      repostAuthor = getLinkObject(repost, 'author', state.json)
      repostedSource = getLinkObject(repost, 'repostedSource', state.json)
      repostedSourceAuthor = getLinkObject(repostedSource, 'author', state.json)
    }
  }
  // subject is a love
  if (notification.subjectType.toLowerCase() === SUBJECT_TYPE.LOVE) {
    loveUser = getLinkObject(subject, 'user', state.json)
    lovePost = getLinkObject(subject, 'post', state.json)
    lovePostAuthor = getLinkObject(lovePost, 'author', state.json)
    // repost
    if (lovePost.repostId) {
      repost = lovePost
      repostAuthor = getLinkObject(repost, 'author', state.json)
      repostedSource = getLinkObject(repost, 'repostedSource', state.json)
      repostedSourceAuthor = getLinkObject(repostedSource, 'author', state.json)
    }
  }
  // subject can be a user as well but we don't
  // need to add any additional properties

  return {
    assets: state.json.assets,
    createdAt: notification.createdAt,
    kind: notification.kind,
    lovePost,
    lovePostAuthor,
    loveUser,
    postAuthor,
    parentPost,
    parentPostAuthor,
    repost,
    repostAuthor,
    repostedSource,
    repostedSourceAuthor,
    subject,
  }
}

export default connect(mapStateToProps)(NotificationParser)

