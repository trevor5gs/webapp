import { createSelector } from 'reselect'
import { get } from 'lodash'
import { selectParamsToken } from './params'
import { selectId as selectProfileId } from './profile'
import { findModel } from '../helpers/json_helper'
import * as MAPPING_TYPES from '../constants/mapping_types'

const selectJson = (state) => get(state, 'json')

// props.post.xxx
export const selectPropsPost = (state, props) => get(props, 'post')
export const selectPropsPostId = (state, props) => get(props, 'post.id')
export const selectPropsPostToken = (state, props) => get(props, 'post.token')
export const selectPropsPostAuthorId = (state, props) => get(props, 'post.authorId')

// Memoized selectors
export const selectIsOwnPost = createSelector(
  [selectPropsPost, selectPropsPostAuthorId, selectProfileId], (post, authorId, profileId) =>
    post && `${authorId}` === `${profileId}`
)

export const selectPostFromPropsPostId = createSelector(
  [selectJson, selectPropsPostId], (json, postId) =>
    (postId ? json[MAPPING_TYPES.POSTS][postId] : null)
)

export const selectPostFromToken = createSelector(
  [selectJson, selectParamsToken], (json, token) =>
    findModel(json, { collection: MAPPING_TYPES.POSTS, findObj: { token } })
)

//   context('#selectPost', () => {
//     it('returns the post object with memoization', () => {
//       const state = { json }
//       const thisParams = { token: 'token1', type: 'paramsType' }
//       const props = { params: thisParams, location }
//       const testPost = get(json, 'posts.1')
//       expect(selectPost(state, props)).to.deep.equal(testPost)
//       const nextState = { ...state, blah: 1 }
//       expect(selectPost(nextState, props)).to.deep.equal(testPost)
//       expect(selectPost.recomputations()).to.equal(1)
//     })
//   })

