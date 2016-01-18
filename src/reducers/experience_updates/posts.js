/* eslint-disable no-param-reassign */
import * as MAPPING_TYPES from '../../constants/mapping_types'
import * as ACTION_TYPES from '../../constants/action_types'
import { methods as jsonMethods } from '../json'

const methods = {}

function updatePostLoves(state, newState, action) {
  const { method, model } = action.payload
  let delta = 0
  let loved = false
  switch (action.type) {
    case ACTION_TYPES.POST.LOVE_REQUEST:
      if (method === 'DELETE') {
        delta = -1
        loved = false
      } else {
        delta = 1
        loved = true
      }
      break
    case ACTION_TYPES.POST.LOVE_FAILURE:
      if (method === 'POST') {
        delta = -1
        loved = false
      } else {
        delta = 1
        loved = true
      }
      break
    default:
      return state
  }
  jsonMethods.mergeModel(
    newState,
    MAPPING_TYPES.POSTS,
    {
      id: model.id,
      lovesCount: Number(model.lovesCount) + delta,
      loved,
    }
  )
  return newState
}
methods.updatePostLoves = (state, newState, action) => {
  return updatePostLoves(state, newState, action)
}

function deletePost(state, newState, action) {
  const { model } = action.payload
  switch (action.type) {
    case ACTION_TYPES.POST.DELETE_REQUEST:
    case ACTION_TYPES.POST.DELETE_SUCCESS:
      delete newState[MAPPING_TYPES.POSTS][model.id]
      break
    case ACTION_TYPES.POST.DELETE_FAILURE:
      // TODO: pop an alert or modal saying 'something went wrong'
      // and we couldn't delete this post?
      newState[MAPPING_TYPES.POSTS][model.id] = model
      break
    default:
      return state
  }
  return newState
}
methods.deletePost = (state, newState, action) => {
  return deletePost(state, newState, action)
}

export default methods

