import Immutable from 'immutable'
import { createSelector } from 'reselect'
import get from 'lodash/get'
import { COMMENTS } from '../constants/mapping_types'
import { selectId as selectProfileId } from './profile'
import { selectPosts } from './post'
import { selectUsers } from './user'

export const selectPropsCommentId = (state, props) =>
  get(props, 'commentId') || get(props, 'comment', Immutable.Map()).get('id')

export const selectComments = state => state.json.get(COMMENTS)

// Memoized selectors

// Requires `commentId` or `comment` to be found in props
export const selectComment = createSelector(
  [selectPropsCommentId, selectComments], (id, comments) =>
    (comments && id ? comments.get(id, Immutable.Map()) : Immutable.Map()),
)

// Properties on the comments reducer
export const selectCommentAuthorId = createSelector([selectComment], comment => comment.get('authorId'))
export const selectCommentBody = createSelector([selectComment], comment => comment.get('body'))
export const selectCommentContent = createSelector([selectComment], comment => comment.get('content'))
export const selectCommentCreatedAt = createSelector([selectComment], comment => comment.get('createdAt'))
export const selectCommentOriginalPostId = createSelector([selectComment], comment => comment.get('originalPostId'))
export const selectCommentPostId = createSelector([selectComment], comment => comment.get('postId'))
export const selectCommentRepostId = createSelector([selectComment], comment => comment.get('repostId'))

// Derived or additive properties
export const selectCommentAuthor = createSelector(
  [selectUsers, selectCommentAuthorId], (users, authorId) =>
    (users && authorId ? users.get(authorId) : null),
)

export const selectCommentPost = createSelector(
  [selectPosts, selectCommentPostId], (posts, postId) =>
    (posts && postId ? posts.get(postId) : Immutable.Map()),
)

export const selectCommentPostAuthorId = createSelector(
  [selectCommentPost], post => post.get('authorId'),
)

export const selectCommentPostAuthor = createSelector(
  [selectUsers, selectCommentPostAuthorId], (users, authorId) =>
    (users && authorId ? users.get(authorId) : null),
)

export const selectCommentPostDetailPath = createSelector(
  [selectCommentPost, selectCommentPostAuthor], (post, author) =>
    `/${author.get('username')}/post/${post.get('token')}`,
)

export const selectCommentIsEditing = createSelector([selectComment], comment =>
  comment.get('isEditing', false),
)

export const selectCommentIsOwn = createSelector(
  [selectCommentAuthorId, selectProfileId], (authorId, profileId) =>
    `${authorId}` === `${profileId}`,
)

export const selectCommentIsOwnPost = createSelector(
  [selectCommentPostAuthorId, selectProfileId], (authorId, profileId) =>
    `${authorId}` === `${profileId}`,
)

export const selectCommentCanBeDeleted = createSelector(
  [selectCommentIsOwnPost, selectCommentPostId, selectCommentOriginalPostId, selectCommentRepostId],
  (isOwnPost, postId, originalPostId, repostId) =>
    (repostId ? (isOwnPost && postId === originalPostId) : isOwnPost),
)

