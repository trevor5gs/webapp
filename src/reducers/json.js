import * as ACTION_TYPES from '../constants/action_types'
import * as MAPPING_TYPES from '../constants/mapping_types'
import uniq from 'lodash.uniq'

function mergeModel(state, type, params) {
  if (params.id) {
    const newType = { ...state[type] }
    newType[params.id] = { ...newType[params.id], ...params }
    state[type] = newType
  }
}

function addModels(state, type, data) {
  // add state['modelType']
  if (!state[type]) { state[type] = {} }
  const ids = []
  if (data[type] && data[type].length) {
    // add arrays of models to state['modelType']['id']
    data[type].map((model) => {
      mergeModel(state, type, model)
      ids.push(model.id)
    })
  } else if (data[type] && typeof data[type] === 'object') {
    // add single model objects to state['modelType']['id']
    const model = data[type]
    mergeModel(state, type, model)
    ids.push(model.id)
  }
  return ids
}

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
  mergeModel(newState, MAPPING_TYPES.POSTS, { id: model.id, lovesCount: Number(model.lovesCount) + delta, loved: loved })
  return newState
}

export function json(state = {}, action = { type: '' }, router) {
  const newState = { ...state }
  if (action.type === ACTION_TYPES.RELATIONSHIPS.UPDATE) {
    const { userId, priority } = action.payload
    const { mappingType } = action.meta
    // TODO: update this user's followerCount +1
    // TODO: update the current user's followingCount +1 (this might happen in the profile reducer)
    mergeModel(newState, mappingType, { id: userId, relationshipPriority: priority })
    return newState
  } else if (action.type === ACTION_TYPES.POST.LOVE_REQUEST || action.type === ACTION_TYPES.POST.LOVE_SUCCESS || action.type === ACTION_TYPES.POST.LOVE_FAILURE) {
    return updatePostLoves(state, newState, action)
  }
  // whitelist actions
  switch (action.type) {
  case ACTION_TYPES.LOAD_NEXT_CONTENT_SUCCESS:
  case ACTION_TYPES.LOAD_STREAM_SUCCESS:
    break
  default:
    return state
  }
  const { response } = action.payload
  if (!response) { return state }
  // parse linked
  if (response.linked) {
    for (const linkedType in response.linked) {
      if ({}.hasOwnProperty.call(response.linked, linkedType)) {
        addModels(newState, linkedType, response.linked)
      }
    }
  }
  // parse main part of request into the state, and save result as this is the main payload
  const { mappingType, resultFilter, resultKey } = action.meta
  const ids = addModels(newState, mappingType, response)
  let result
  // set the result to the resultFilter if it exists
  if (resultFilter && typeof resultFilter === 'function') {
    result = resultFilter(response[mappingType])
  } else {
    result = { type: mappingType, ids: ids }
  }
  result.pagination = action.payload.pagination
  if (!newState.pages) { newState.pages = {} }
  const resultPath = resultKey ? `${router.location.pathname}_${resultKey}` : router.location.pathname
  let existingResult = newState.pages[resultPath]
  if (existingResult && action.type === ACTION_TYPES.LOAD_NEXT_CONTENT_SUCCESS) {
    existingResult.pagination = result.pagination
    if (existingResult.next) {
      existingResult.next.ids = uniq(existingResult.next.ids.concat(result.ids))
    } else {
      existingResult.next = result
    }
  } else if (existingResult) {
    existingResult = { ...existingResult, ...result }
  } else {
    newState.pages[resultPath] = result
  }
  return newState
}

