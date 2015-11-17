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

function updateRelationship(newState, action) {
  const { userId, priority } = action.payload
  const { mappingType } = action.meta
  // TODO: update this user's followerCount +1
  // TODO: update the current user's followingCount +1 (this might happen in the profile reducer)
  mergeModel(newState, mappingType, { id: userId, relationshipPriority: priority })
  return newState
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

// parses the 'linked' node of the JSON
// api responses into the json store
function parseLinked(linked, newState) {
  if (!linked) { return }
  for (const linkedType in linked) {
    if ({}.hasOwnProperty.call(linked, linkedType)) {
      addModels(newState, linkedType, linked)
    }
  }
}

// parse main part of request into the state and
// pull out the ids as this is the main payload
function getResult(response, newState, action) {
  const { mappingType, resultFilter } = action.meta
  const ids = addModels(newState, mappingType, response)
  // set the result to the resultFilter if it exists
  const result = typeof resultFilter === 'function' ? resultFilter(response[mappingType]) : { type: mappingType, ids: ids }
  result.pagination = action.payload.pagination
  return result
}

function updateResult(response, newState, action, router) {
  if (!newState.pages) { newState.pages = {} }
  const result = getResult(response, newState, action)
  const { resultKey } = action.meta
  const resultPath = resultKey ? `${router.location.pathname}_${resultKey}` : router.location.pathname
  const existingResult = newState.pages[resultPath]
  if (action.type === ACTION_TYPES.LOAD_NEXT_CONTENT_SUCCESS) {
    if (existingResult) {
      existingResult.pagination = result.pagination
      if (!existingResult.next) {
        existingResult.next = result
      } else {
        existingResult.next.ids = uniq(existingResult.next.ids.concat(result.ids))
      }
    }
  } else {
    if (existingResult) {
      newState.pages[resultPath] = { ...existingResult, ...result }
    } else {
      newState.pages[resultPath] = result
    }
  }
}

export function json(state = {}, action = { type: '' }, router) {
  const newState = { ...state }
  // these are basically the equivilent of experience updates in iOS
  if (action.type === ACTION_TYPES.RELATIONSHIPS.UPDATE) {
    return updateRelationship(newState, action)
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
  // parse the linked part of the response into the state
  parseLinked(response.linked, newState)
  // parse main part of response into the state
  // and update the paging information
  updateResult(response, newState, action, router)
  return newState
}


