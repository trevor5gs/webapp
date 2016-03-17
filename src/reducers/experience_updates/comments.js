/* eslint-disable no-param-reassign */
import * as ACTION_TYPES from '../../constants/action_types'
import * as MAPPING_TYPES from '../../constants/mapping_types'
import * as jsonReducer from '../../reducers/json'
import { emptyPagination } from '../../components/streams/Paginator'

const methods = {}

function _updateCommentsCount(newState, postId, delta) {
  const commentCount = newState[MAPPING_TYPES.POSTS][postId].commentsCount
  jsonReducer.methods.mergeModel(
    newState,
    MAPPING_TYPES.POSTS,
    {
      id: postId,
      commentsCount: Number(commentCount) + delta,
    }
  )
  return newState
}
methods.updateCommentsCount = (newState, postId, delta) =>
  _updateCommentsCount(newState, postId, delta)

function _addOrUpdateComment(newState, action) {
  const { model, postId } = action.payload
  const post = newState[MAPPING_TYPES.POSTS][postId]
  let response = null
  let index = null
  switch (action.type) {
    case ACTION_TYPES.COMMENT.CREATE_SUCCESS:
    case ACTION_TYPES.COMMENT.UPDATE_SUCCESS:
      response = action.payload.response
      // the comments wouldn't exist if you refreshed
      // on a post detail that didn't have any comments
      if (!newState[MAPPING_TYPES.COMMENTS]) {
        newState[MAPPING_TYPES.COMMENTS] = {}
      }
      newState[MAPPING_TYPES.COMMENTS][response.id] = response
      if (action.type === ACTION_TYPES.COMMENT.UPDATE_SUCCESS) { return newState }
      // add the comment to the linked array
      if (post.links && post.links.comments) {
        post.links.comments.ids.unshift(`${response.id}`)
      }
      if (newState.pages[`/posts/${postId}/comments`]) {
        newState.pages[`/posts/${postId}/comments`].ids.unshift(response.id)
      } else {
        newState.pages[`/posts/${postId}/comments`] = {
          ids: [response.id], type: MAPPING_TYPES.COMMENTS, pagination: emptyPagination(),
        }
      }
      return methods.updateCommentsCount(newState, postId, 1)
    case ACTION_TYPES.COMMENT.DELETE_SUCCESS:
      // add the comment to the linked array
      if (post.links && post.links.comments) {
        index = post.links.comments.ids.indexOf(model.id)
        if (index > -1) {
          post.links.comments.ids.splice(index, 1)
        }
      }
      if (newState.pages[`/posts/${postId}/comments`]) {
        index = newState.pages[`/posts/${postId}/comments`].ids.indexOf(model.id)
        if (index > -1) {
          newState.pages[`/posts/${postId}/comments`].ids.splice(index, 1)
        }
      }
      return methods.updateCommentsCount(newState, postId, -1)
    case ACTION_TYPES.COMMENT.CREATE_FAILURE:
      return methods.updateCommentsCount(newState, postId, -1)
    default:
      return newState
  }
}
methods.addOrUpdateComment = (newState, action) =>
  _addOrUpdateComment(newState, action)

function _toggleEditing(newState, action) {
  const { model, isEditing } = action.payload
  newState[MAPPING_TYPES.COMMENTS][model.id].isEditing = isEditing
  return newState
}
methods.toggleEditing = (newState, action) =>
  _toggleEditing(newState, action)

export default methods

