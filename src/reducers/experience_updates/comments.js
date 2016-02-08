/* eslint-disable no-param-reassign */
import * as MAPPING_TYPES from '../../constants/mapping_types'
import * as ACTION_TYPES from '../../constants/action_types'

const methods = {}

function deleteComment(state, newState, action) {
  const { model } = action.payload
  if (!newState[`deleted_${MAPPING_TYPES.COMMENTS}`]) {
    newState[`deleted_${MAPPING_TYPES.COMMENTS}`] = []
  }
  switch (action.type) {
    case ACTION_TYPES.COMMENT.DELETE_REQUEST:
    case ACTION_TYPES.COMMENT.DELETE_SUCCESS:
      delete newState[MAPPING_TYPES.COMMENTS][model.id]
      if (newState[`deleted_${MAPPING_TYPES.COMMENTS}`].indexOf(model.id) === -1) {
        newState[`deleted_${MAPPING_TYPES.COMMENTS}`].push(model.id)
      }
      break
    case ACTION_TYPES.COMMENT.DELETE_FAILURE:
      // TODO: pop an alert or modal saying 'something went wrong'
      // and we couldn't delete this post?
      newState[MAPPING_TYPES.COMMENTS][model.id] = model
      newState[`deleted_${MAPPING_TYPES.COMMENTS}`].splice(
        newState[`deleted_${MAPPING_TYPES.COMMENTS}`].indexOf(model.id),
        1
      )
      break
    default:
      return state
  }
  return newState
}
methods.deleteComment = (state, newState, action) =>
  deleteComment(state, newState, action)

export default methods

