/* eslint-disable no-param-reassign */
import * as ACTION_TYPES from '../../constants/action_types'
import * as MAPPING_TYPES from '../../constants/mapping_types'
import * as jsonReducer from '../../reducers/json'
import _ from 'lodash'

const methods = {}

function _updatePostLoves(state, newState, action) {
  const { method, model } = action.payload

  const newPost = {
    id: model ? model.id : '',
  }

  let delta = 0
  let idAdded = false
  switch (action.type) {
    case ACTION_TYPES.POST.LOVE_FAILURE:
      if (method === 'POST') {
        delta = -1
        newPost.loved = false
      } else {
        delta = 1
        newPost.loved = true
        idAdded = true
      }
      break
    case ACTION_TYPES.POST.LOVE_SUCCESS:
      if (method === 'POST') {
        delta = 1
        newPost.loved = true
        newPost.showLovers = true
        idAdded = true
      } else {
        delta = -1
        newPost.loved = false
        newPost.showLovers = false
      }
      break
    default:
      return state
  }

  // since we pull `model` out of payload, not state, we don't want to set
  // or update the lovesCount during a LOVE_SUCCESS.
  //
  // During LOVE_REQUEST, model.lovesCount is incremented.
  // In LOVE_SUCCESS, model.lovesCount is the *old* value, so just ignore it.
  if (delta !== 0) {
    newPost.lovesCount = Number(model.lovesCount) + delta
  }

  const resultPath = jsonReducer.methods.pagesKey(action)
  const currentUser = jsonReducer.methods.getCurrentUser(newState)
  if (currentUser) {
    if (idAdded) {
      jsonReducer.methods.appendPageId(
        newState, resultPath,
        MAPPING_TYPES.USERS, currentUser.id)
    } else {
      jsonReducer.methods.removePageId(
        newState, resultPath,
        currentUser.id)
    }
  }

  jsonReducer.methods.updateUserCount(newState, model.authorId, 'lovesCount', delta)
  jsonReducer.methods.mergeModel(
    newState,
    MAPPING_TYPES.POSTS,
    newPost
  )

  return newState
}
methods.updatePostLoves = (state, newState, action) =>
  _updatePostLoves(state, newState, action)

function _addOrUpdatePost(newState, action) {
  const { model, response } = action.payload

  const user = model ?
    newState[MAPPING_TYPES.USERS][model.authorId] :
    jsonReducer.methods.getCurrentUser(newState)
  let index = null
  switch (action.type) {
    case ACTION_TYPES.POST.CREATE_SUCCESS:
      _.set(newState, [MAPPING_TYPES.POSTS, response.id], response)
      jsonReducer.methods.appendPageId(
        newState, '/following',
        MAPPING_TYPES.POSTS, response.id)

      if (action.meta.repostId) {
        jsonReducer.methods.updatePostCount(newState, action.meta.repostId, 'repostsCount', 1)
        jsonReducer.methods.appendPageId(
          newState, `/posts/${action.meta.repostId}/repost`,
          MAPPING_TYPES.USERS, user.id)
        jsonReducer.methods.mergeModel(
          newState,
          MAPPING_TYPES.POSTS,
          { id: action.meta.repostId, reposted: true }
        )
      }
      if (action.meta.repostedFromId) {
        jsonReducer.methods.updatePostCount(newState, action.meta.repostedFromId, 'repostsCount', 1)
        jsonReducer.methods.appendPageId(
          newState, `/posts/${action.meta.repostedFromId}/repost`,
          MAPPING_TYPES.USERS, user.id)
        jsonReducer.methods.mergeModel(
          newState,
          MAPPING_TYPES.POSTS,
          { id: action.meta.repostedFromId, reposted: true }
        )
      }
      if (user) {
        jsonReducer.methods.updateUserCount(newState, user.id, 'postsCount', 1)
        jsonReducer.methods.appendPageId(
          newState, `/${user.username}`,
          MAPPING_TYPES.POSTS, response.id)
      }
      return newState
    case ACTION_TYPES.POST.DELETE_SUCCESS:
      if (user) {
        if (newState.pages['/following']) {
          index = newState.pages['/following'].ids.indexOf(`${user.id}`)
          if (index > -1) {
            newState.pages['/following'].ids.splice(index, 1)
          }
        }
        jsonReducer.methods.updateUserCount(newState, user.id, 'postsCount', -1)
        if (newState.pages[`/${user.username}`]) {
          index = newState.pages[`/${user.username}`].ids.indexOf(`${model.id}`)
          if (index > -1) {
            newState.pages[`/${user.username}`].ids.splice(index, 1)
          }
        }
      }
      return newState
    case ACTION_TYPES.POST.CREATE_FAILURE:
      if (user) {
        jsonReducer.methods.updateUserCount(newState, user.id, 'postsCount', -1)
      }
      return newState
    case ACTION_TYPES.POST.UPDATE_SUCCESS:
      newState[MAPPING_TYPES.POSTS][response.id] = response
      return newState
    default:
      return newState
  }
}
methods.addOrUpdatePost = (newState, action) =>
  _addOrUpdatePost(newState, action)

function _toggleComments(newState, action) {
  const { model, showComments } = action.payload
  newState[MAPPING_TYPES.POSTS][model.id].showComments = showComments
  return newState
}
methods.toggleComments = (newState, action) =>
  _toggleComments(newState, action)

function _toggleEditing(newState, action) {
  const { model, isEditing } = action.payload
  newState[MAPPING_TYPES.POSTS][model.id].isEditing = isEditing
  return newState
}
methods.toggleEditing = (newState, action) =>
  _toggleEditing(newState, action)

function _toggleLovers(newState, action) {
  const { model, showLovers } = action.payload
  newState[MAPPING_TYPES.POSTS][model.id].showLovers = showLovers
  return newState
}
methods.toggleLovers = (newState, action) =>
  _toggleLovers(newState, action)

function _toggleReposting(newState, action) {
  const { model, isReposting } = action.payload
  newState[MAPPING_TYPES.POSTS][model.id].isReposting = isReposting
  return newState
}
methods.toggleReposting = (newState, action) =>
  _toggleReposting(newState, action)

function _toggleReposters(newState, action) {
  const { model, showReposters } = action.payload
  newState[MAPPING_TYPES.POSTS][model.id].showReposters = showReposters
  return newState
}
methods.toggleReposters = (newState, action) =>
  _toggleReposters(newState, action)

export default methods

