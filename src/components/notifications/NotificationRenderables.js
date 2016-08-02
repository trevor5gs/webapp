import React, { PropTypes } from 'react'
import { Link } from 'react-router'
import { regionItemsForNotifications } from '../regions/RegionRenderables'
import { Notification } from './Notification'

// HELPERS
function getActivityPath(user, post) {
  if (!user) { return '/' }
  if (!post) { return `/${user.username}` }
  return `/${user.username}/post/${post.token}`
}

const UserTextLink = ({ user }) => {
  if (!user) { return null }
  return (
    <Link to={getActivityPath(user)}>
      {`@${user.username}`}
    </Link>
  )
}
UserTextLink.propTypes = {
  user: PropTypes.object,
}

const PostTextLink = ({ author, post, text = 'post' }) => {
  if (!post || !author) { return text }
  return (
    <Link to={getActivityPath(author, post)}>
      {text}
    </Link>
  )
}
PostTextLink.propTypes = {
  author: PropTypes.object,
  post: PropTypes.object,
  text: PropTypes.string,
}

function parseSummary(post, path) {
  return regionItemsForNotifications(post.summary, path)
}

function parseSummaryForCommentNotification(post, comment, path) {
  const postContent = post && post.summary ? post.summary : []
  const commentContent = comment && comment.summary ? comment.summary : []
  const divider = [{ kind: 'rule' }]
  const combined = postContent.concat(divider, commentContent)
  return regionItemsForNotifications(combined, path)
}

// COMMENTS
function commentNotification(comment, createdAt, { author, parentPost, parentPostAuthor }) {
  const activityPath = getActivityPath(parentPostAuthor, parentPost)
  const summary = parseSummaryForCommentNotification(parentPost, comment, activityPath)
  return (
    <Notification
      activityPath={activityPath}
      className="CommentNotification"
      createdAt={createdAt}
      notifier={author}
      summary={summary}
    >
      <p>
        <UserTextLink user={author} />
        {' commented on your '}
        <PostTextLink author={author} post={parentPost} />
        {'.'}
      </p>
    </Notification>
  )
}

function commentMentionNotification(comment, createdAt, { author, parentPost, parentPostAuthor }) {
  const activityPath = getActivityPath(parentPostAuthor, parentPost)
  const summary = parseSummaryForCommentNotification(parentPost, comment, activityPath)
  return (
    <Notification
      activityPath={activityPath}
      className="CommentMentionNotification"
      createdAt={createdAt}
      notifier={author}
      summary={summary}
    >
      <p>
        <UserTextLink user={author} />
        {' mentioned you in a '}
        <PostTextLink author={author} post={parentPost} text="comment" />
        {'.'}
      </p>
    </Notification>
  )
}

function commentOnOriginalPostNotification(comment, createdAt,
                                           {
                                             author,
                                             repost,
                                             repostAuthor,
                                             repostedSource,
                                             repostedSourceAuthor,
                                           }) {
  const activityPath = getActivityPath(author, repostedSource)
  const summary = parseSummaryForCommentNotification(repostedSource, comment, activityPath)
  return (
    <Notification
      activityPath={activityPath}
      className="CommentOnPostNotification"
      createdAt={createdAt}
      notifier={author}
      summary={summary}
    >
      <p>
        <UserTextLink user={author} />
        {' commented on '}
        <UserTextLink user={repostAuthor} />
        {'\'s '}
        <PostTextLink author={repostAuthor} post={repost} text="repost" />
        {' of your '}
        <PostTextLink author={repostedSourceAuthor} post={repostedSource} />
        {'.'}
      </p>
    </Notification>
  )
}

function commentOnRepostNotification(comment, createdAt, { author, repost, repostAuthor }) {
  const activityPath = getActivityPath(author, repost)
  const summary = parseSummaryForCommentNotification(repost, comment, activityPath)
  return (
    <Notification
      activityPath={activityPath}
      className="CommentOnRepostNotification"
      createdAt={createdAt}
      notifier={author}
      summary={summary}
    >
      <p>
        <UserTextLink user={author} />
        {' commented on your '}
        <PostTextLink author={repostAuthor} post={repost} text="repost" />
        {'.'}
      </p>
    </Notification>
  )
}

// INVITATIONS
function invitationAcceptedNotification(user, createdAt) {
  return (
    <Notification
      activityPath={getActivityPath(user)}
      className="InvitationAcceptedNotification"
      createdAt={createdAt}
      notifier={user}
    >
      <p>
        <UserTextLink user={user} />
        {' accepted your invitation.'}
      </p>
    </Notification>
  )
}

// LOVES
function loveNotification(love, createdAt, { author, post, user }) {
  const activityPath = getActivityPath(user, post)
  const summary = parseSummary(post, activityPath)
  return (
    <Notification
      activityPath={activityPath}
      className="LoveNotification"
      createdAt={createdAt}
      notifier={user}
      summary={summary}
    >
      <p>
        <UserTextLink user={user} />
        {' loved your '}
        <PostTextLink author={author} post={post} />
        {'.'}
      </p>
    </Notification>
  )
}

function loveOnRepostNotification(love, createdAt, { repost, repostAuthor, user }) {
  const activityPath = getActivityPath(user, repost)
  const summary = parseSummary(repost, activityPath)
  return (
    <Notification
      activityPath={activityPath}
      className="LoveOnRepostNotification"
      createdAt={createdAt}
      notifier={user}
      summary={summary}
    >
      <p>
        <UserTextLink user={user} />
        {' loved your '}
        <PostTextLink author={repostAuthor} post={repost} text="repost" />
        {'.'}
      </p>
    </Notification>
  )
}

function loveOnOriginalPostNotification(love, createdAt,
                                        {
                                          repost,
                                          repostAuthor,
                                          repostedSource,
                                          repostedSourceAuthor,
                                          user,
                                        }) {
  const activityPath = getActivityPath(user, repost)
  const summary = parseSummary(repost, activityPath)
  return (
    <Notification
      activityPath={activityPath}
      className="LoveOnOriginalPostNotification"
      createdAt={createdAt}
      notifier={user}
      summary={summary}
    >
      <p>
        <UserTextLink user={user} />
        {' loved '}
        <UserTextLink user={repostAuthor} />
        {'\'s '}
        <PostTextLink author={repostAuthor} post={repost} text="repost" />
        {' of your '}
        <PostTextLink author={repostedSourceAuthor} post={repostedSource} />
        {'.'}
      </p>
    </Notification>
  )
}

// MENTIONS
function postMentionNotification(post, createdAt, { author }) {
  const activityPath = getActivityPath(author, post)
  const summary = parseSummary(post, activityPath)
  return (
    <Notification
      activityPath={activityPath}
      className="PostMentionNotification"
      createdAt={createdAt}
      notifier={author}
      summary={summary}
    >
      <p>
        <UserTextLink user={author} />
        {' mentioned you in a '}
        <PostTextLink author={author} post={post} />
        {'.'}
      </p>
    </Notification>
  )
}

// RELATIONSHIPS
function newFollowerPost(user, createdAt) {
  return (
    <Notification
      activityPath={getActivityPath(user)}
      className="NewFollowerPostNotification"
      createdAt={createdAt}
      notifier={user}
    >
      <p>
        <UserTextLink user={user} />
        {' started following you.'}
      </p>
    </Notification>
  )
}

function newFollowedUserPost(user, createdAt) {
  return (
    <Notification
      activityPath={getActivityPath(user)}
      className="NewFollowedUserPostNotification"
      createdAt={createdAt}
      notifier={user}
    >
      <p>
        {'You started following '}
        <UserTextLink user={user} />
        {'.'}
      </p>
    </Notification>
  )
}

// REPOSTS
function repostNotification(post, createdAt, { author }) {
  const activityPath = getActivityPath(author, post)
  const summary = parseSummary(post, activityPath)
  return (
    <Notification
      activityPath={activityPath}
      className="RepostNotification"
      createdAt={createdAt}
      notifier={author}
      summary={summary}
    >
      <p>
        <UserTextLink user={author} />
        {' reposted your '}
        <PostTextLink author={author} post={post} />
        {'.'}
      </p>
    </Notification>
  )
}

