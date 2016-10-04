/* eslint-disable no-param-reassign */
import setWith from 'lodash/setWith'
import * as ACTION_TYPES from '../../constants/action_types'
import * as MAPPING_TYPES from '../../constants/mapping_types'
import * as jsonReducer from '../../reducers/json'
import postMethods from './posts'

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
  const { hasAutoWatchEnabled, model, postId, response } = action.payload
  const post = newState[MAPPING_TYPES.POSTS][postId]
  let index = null
  switch (action.type) {
    case ACTION_TYPES.COMMENT.CREATE_REQUEST:
      return postMethods.updatePostWatch(newState, {
        payload: { method: 'POST', model: post, hasAutoWatchEnabled },
      })
    case ACTION_TYPES.COMMENT.CREATE_SUCCESS:
    case ACTION_TYPES.COMMENT.UPDATE_SUCCESS:
      setWith(newState,
                [MAPPING_TYPES.COMMENTS, response[MAPPING_TYPES.COMMENTS].id],
                response[MAPPING_TYPES.COMMENTS],
                Object)
      if (action.type === ACTION_TYPES.COMMENT.UPDATE_SUCCESS) { return newState }
      // update post watching prop
      newState = postMethods.updatePostWatch(newState, {
        payload: { method: 'POST', model: post },
      })
      // add the comment to the linked array
      if (post.links && post.links.comments) {
        post.links.comments.ids.unshift(`${response[MAPPING_TYPES.COMMENTS].id}`)
      }
      jsonReducer.methods.appendPageId(
        newState, `/posts/${postId}/comments`,
        MAPPING_TYPES.COMMENTS, response[MAPPING_TYPES.COMMENTS].id)
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
      postMethods.updatePostWatch(newState, {
        payload: { method: 'DELETE', model: post },
      })
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

