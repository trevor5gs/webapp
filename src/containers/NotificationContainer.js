import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { isEqual } from 'lodash'
import { getLinkObject } from '../helpers/json_helper'
import * as MAPPING_TYPES from '../constants/mapping_types'
import {
  CommentNotification,
  CommentMentionNotification,
  CommentOnOriginalPostNotification,
  CommentOnRepostNotification,
  InvitationAcceptedNotification,
  LoveNotification,
  LoveOnOriginalPostNotification,
  LoveOnRepostNotification,
  NewFollowerPost,
  NewFollowedUserPost,
  PostMentionNotification,
  RepostNotification,
} from '../components/notifications/NotificationRenderables'

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
  return !isEqual(thisProps, nextProps)
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
    postAuthor = getLinkObject(subject, 'author', state.json) ||
      state.json[MAPPING_TYPES.USERS][subject.authorId]
    // comment
    if (subject.postId) {
      parentPost = getLinkObject(subject, 'parentPost', state.json)
      parentPostAuthor = getLinkObject(parentPost, 'author', state.json) ||
        state.json[MAPPING_TYPES.USERS][parentPost.authorId]
    }
    // repost
    if (parentPost && parentPost.repostId) {
      repost = parentPost
      repostAuthor = getLinkObject(repost, 'author', state.json) ||
        state.json[MAPPING_TYPES.USERS][repost.authorId]
      repostedSource = getLinkObject(repost, 'repostedSource', state.json)
      repostedSourceAuthor = getLinkObject(repostedSource, 'author', state.json) ||
        state.json[MAPPING_TYPES.USERS][repostedSource.authorId]
    }
  }
  // subject is a love
  if (notification.subjectType.toLowerCase() === SUBJECT_TYPE.LOVE) {
    loveUser = getLinkObject(subject, 'user', state.json)
    lovePost = getLinkObject(subject, 'post', state.json)
    lovePostAuthor = getLinkObject(lovePost, 'author', state.json) ||
      state.json[MAPPING_TYPES.USERS][lovePost.authorId]
    // repost
    if (lovePost.repostId) {
      repost = lovePost
      repostAuthor = getLinkObject(repost, 'author', state.json)
      repostedSource = getLinkObject(repost, 'repostedSource', state.json)
      repostedSourceAuthor = getLinkObject(repostedSource, 'author', state.json) ||
        state.json[MAPPING_TYPES.USERS][repostedSource.authorId]
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
      assets,
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

    switch (kind) {
      case NOTIFICATION_KIND.COMMENT:
        return (
          <CommentNotification
            assets={assets}
            author={postAuthor}
            comment={subject}
            createdAt={createdAt}
            parentPost={parentPost}
            parentPostAuthor={parentPostAuthor}
          />
        )
      case NOTIFICATION_KIND.COMMENT_MENTION:
        return (
          <CommentMentionNotification
            assets={assets}
            author={postAuthor}
            comment={subject}
            createdAt={createdAt}
            parentPost={parentPost}
            parentPostAuthor={parentPostAuthor}
          />
        )
      case NOTIFICATION_KIND.COMMENT_ORIGINAL:
        return (
          <CommentOnOriginalPostNotification
            assets={assets}
            author={postAuthor}
            comment={subject}
            createdAt={createdAt}
            repost={repost}
            repostAuthor={repostAuthor}
            repostedSource={repostedSource}
            repostedSourceAuthor={repostedSourceAuthor}
          />
        )
      case NOTIFICATION_KIND.COMMENT_REPOST:
        return (
          <CommentOnRepostNotification
            assets={assets}
            author={postAuthor}
            comment={subject}
            createdAt={createdAt}
            repost={repost}
            repostAuthor={repostAuthor}
          />
        )
      case NOTIFICATION_KIND.INVITATION_ACCEPTED:
        return <InvitationAcceptedNotification createdAt={createdAt} user={subject} />
      case NOTIFICATION_KIND.LOVE:
        return (
          <LoveNotification
            assets={assets}
            author={lovePostAuthor}
            createdAt={createdAt}
            post={lovePost}
            user={loveUser}
          />
        )
      case NOTIFICATION_KIND.LOVE_ORIGINAL:
        return (
          <LoveOnOriginalPostNotification
            assets={assets}
            createdAt={createdAt}
            repost={repost}
            repostAuthor={repostAuthor}
            repostedSource={repostedSource}
            repostedSourceAuthor={repostedSourceAuthor}
            user={loveUser}
          />
        )
      case NOTIFICATION_KIND.LOVE_REPOST:
        return (
          <LoveOnRepostNotification
            assets={assets}
            createdAt={createdAt}
            repost={repost}
            repostAuthor={repostAuthor}
            user={loveUser}
          />
        )
      case NOTIFICATION_KIND.NEW_FOLLOWER:
        return <NewFollowerPost createdAt={createdAt} user={subject} />
      case NOTIFICATION_KIND.NEW_FOLLOWED_USER:
        return <NewFollowedUserPost createdAt={createdAt} user={subject} />
      case NOTIFICATION_KIND.POST_MENTION:
        return (
          <PostMentionNotification
            assets={assets}
            author={postAuthor}
            createdAt={createdAt}
            post={subject}
          />
        )
      case NOTIFICATION_KIND.REPOST:
        return (
          <RepostNotification
            assets={assets}
            author={postAuthor}
            createdAt={createdAt}
            post={subject}
          />
        )
      case NOTIFICATION_KIND.WELCOME:
        return <p>Welcome to Ello!</p>
      default:
        return null
    }
  }
}

export default connect(mapStateToProps)(NotificationParser)

