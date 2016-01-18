/* eslint-disable no-param-reassign */
import * as MAPPING_TYPES from '../../constants/mapping_types'
import * as ACTION_TYPES from '../../constants/action_types'

const methods = {}

function deleteComment(state, newState, action) {
  const { model } = action.payload
  switch (action.type) {
    case ACTION_TYPES.COMMENT.DELETE_REQUEST:
    case ACTION_TYPES.COMMENT.DELETE_SUCCESS:
      delete newState[MAPPING_TYPES.COMMENTS][model.id]
      break
    case ACTION_TYPES.COMMENT.DELETE_FAILURE:
      // TODO: pop an alert or modal saying 'something went wrong'
      // and we couldn't delete this comment?
      newState[MAPPING_TYPES.COMMENTS][model.id] = model
      break
    default:
      return state
  }
  return newState
}
methods.deleteComment = (state, newState, action) => {
  return deleteComment(state, newState, action)
}

export default methods

