import { createSelector } from 'reselect'
import { get } from 'lodash'
import { selectId as selectProfileId } from './profile'

// props.post.xxx
export const selectPropsPost = (state, props) => get(props, 'post')
export const selectPropsPostId = (state, props) => get(props, 'post.id')
export const selectPropsPostAuthorId = (state, props) => get(props, 'post.authorId')

// Memoized Selectors
export const selectIsOwnPost = createSelector(
  [selectPropsPost, selectPropsPostAuthorId, selectProfileId], (post, authorId, profileId) =>
    post && `${authorId}` === `${profileId}`
)

