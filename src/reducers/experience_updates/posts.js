/* eslint-disable no-param-reassign */
import * as ACTION_TYPES from '../../constants/action_types'
import * as MAPPING_TYPES from '../../constants/mapping_types'
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
  jsonMethods.updateUserCount(newState, model.authorId, 'lovesCount', delta)
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
methods.updatePostLoves = (state, newState, action) =>
  updatePostLoves(state, newState, action)

function addOrUpdatePost(newState, action) {
  const { model, response } = action.payload
  const user = model ?
    newState[MAPPING_TYPES.USERS][model.authorId] :
    jsonMethods.getCurrentUser(newState)
  switch (action.type) {
    case ACTION_TYPES.POST.CREATE_SUCCESS:
      newState[MAPPING_TYPES.POSTS][response.id] = response
      if (newState.pages['/following']) {
        newState.pages['/following'].ids.unshift(response.id)
      }
      if (user) {
        jsonMethods.updateUserCount(newState, user.id, 'postsCount', 1)
        if (newState.pages[`/${user.username}`]) {
          newState.pages[`/${user.username}`].ids.unshift(response.id)
        }
      }
      return newState
    case ACTION_TYPES.POST.DELETE_SUCCESS:
    case ACTION_TYPES.POST.CREATE_FAILURE:
      if (user) {
        jsonMethods.updateUserCount(newState, user.id, 'postsCount', -1)
      }
      return newState
    default:
      return newState
  }
  return newState
}
methods.addOrUpdatePost = (newState, action) =>
  addOrUpdatePost(newState, action)

function toggleComments(state, newState, action) {
  const { model, showComments } = action.payload
  newState[MAPPING_TYPES.POSTS][model.id].showComments = showComments
  return newState
}
methods.toggleComments = (state, newState, action) =>
  toggleComments(state, newState, action)

function toggleEditing(state, newState, action) {
  const { model, isEditing } = action.payload
  newState[MAPPING_TYPES.POSTS][model.id].isEditing = isEditing
  return newState
}
methods.toggleEditing = (state, newState, action) =>
  toggleEditing(state, newState, action)

function toggleReposting(state, newState, action) {
  const { model, isReposting } = action.payload
  newState[MAPPING_TYPES.POSTS][model.id].isReposting = isReposting
  return newState
}
methods.toggleReposting = (state, newState, action) =>
  toggleReposting(state, newState, action)

export default methods

