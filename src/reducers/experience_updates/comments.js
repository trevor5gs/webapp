/* eslint-disable no-param-reassign */
import * as ACTION_TYPES from '../../constants/action_types'
import * as MAPPING_TYPES from '../../constants/mapping_types'
import * as jsonReducer from '../../reducers/json'

const methods = {}

methods.updateCommentsCount = (newState, postId, delta) => {
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

methods.addOrUpdateComment = (newState, action) => {
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
      jsonReducer.methods.appendPageId(
        newState, `/posts/${postId}/comments`,
        MAPPING_TYPES.COMMENTS, response.id)
      return methods.updateCommentsCount(newState, postId, 1)
    case ACTION_TYPES.COMMENT.DELETE_SUCCESS:
      // add the comment to the linked array
      if (post.links && post.links.comments) {
        index = post.links.comments.ids.indexOf(`${model.id}`)
        if (index > -1) {
          post.links.comments.ids.splice(index, 1)
        }
      }
      jsonReducer.methods.removePageId(newState, `/posts/${postId}/comments`, model.id)
      return methods.updateCommentsCount(newState, postId, -1)
    case ACTION_TYPES.COMMENT.CREATE_FAILURE:
      return methods.updateCommentsCount(newState, postId, -1)
    default:
      return newState
  }
}

methods.toggleEditing = (newState, action) => {
  const { model, isEditing } = action.payload
  newState[MAPPING_TYPES.COMMENTS][model.id].isEditing = isEditing
  return newState
}

export default methods

