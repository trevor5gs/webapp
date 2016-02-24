import * as ACTION_TYPES from '../../constants/action_types'
import * as MAPPING_TYPES from '../../constants/mapping_types'
import { methods as jsonMethods } from '../json'

const methods = {}

function updateCommentsCount(newState, postId, delta) {
  const commentCount = newState[MAPPING_TYPES.POSTS][postId].commentsCount
  jsonMethods.mergeModel(
    newState,
    MAPPING_TYPES.POSTS,
    {
      id: postId,
      commentsCount: Number(commentCount) + delta,
    }
  )
  return newState
}

function addOrUpdateComment(newState, action) {
  const { postId } = action.payload
  switch (action.type) {
    case ACTION_TYPES.COMMENT.CREATE_SUCCESS:
      return updateCommentsCount(newState, postId, 1)
    case ACTION_TYPES.COMMENT.CREATE_FAILURE:
      return updateCommentsCount(newState, postId, -1)
    default:
      return newState
  }
}
methods.addOrUpdateComment = (newState, action) =>
  addOrUpdateComment(newState, action)

export default methods

