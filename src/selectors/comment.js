import { createSelector } from 'reselect'
import { get } from 'lodash'
import { selectId as selectProfileId } from './profile'
import * as MAPPING_TYPES from '../constants/mapping_types'

const selectJson = (state) => get(state, 'json')

// props.comment.xxx
export const selectPropsComment = (state, props) => get(props, 'comment')
export const selectPropsCommentId = (state, props) => get(props, 'comment.id')
export const selectPropsCommentAuthorId = (state, props) => get(props, 'comment.authorId')

// Memoized selectors
export const selectIsOwnComment = createSelector(
  [selectPropsComment, selectPropsCommentAuthorId, selectProfileId],
  (comment, authorId, profileId) =>
    comment && `${authorId}` === `${profileId}`
)

export const selectCommentFromPropsCommentId = createSelector(
  [selectJson, selectPropsCommentId], (json, commentId) =>
    (commentId ? json[MAPPING_TYPES.COMMENTS][commentId] : null)
)

