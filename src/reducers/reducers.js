import * as ACTION_TYPES from '../constants/action_types'

export function stream(state = {}, action = { type: '' }) {
  if (action.type.indexOf('LOAD_STREAM') === -1) {
    return state
  }
  return {
    ...state,
    error: action.error,
    meta: action.meta,
    payload: action.payload,
    type: action.type,
  }
}

export function staticPage(state = {}, action = { type: '' }) {
  if (action.type.indexOf('STATIC_PAGE') === -1) {
    return state
  }
  return {
    ...state,
    error: action.error,
    meta: action.meta,
    payload: action.payload,
    type: action.type,
  }
}

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

export function json(state = {}, action = { type: '' }) {
  const newState = { ...state }
  if (action.type === ACTION_TYPES.RELATIONSHIPS.UPDATE) {
    const { userId, priority } = action.payload
    const { mappingType } = action.meta
    // TODO: update this user's followerCount +1
    // TODO: update the current user's followingCount +1 (this might happen in the profile reducer)
    mergeModel(newState, mappingType, { id: userId, relationshipPriority: priority })
    return newState
  } else if (action.type !== ACTION_TYPES.LOAD_STREAM_SUCCESS) {
    return state
  }
  const { response } = action.payload
  // parse linked
  if (response.linked) {
    for (const linkedType in response.linked) {
      if ({}.hasOwnProperty.call(response.linked, linkedType)) {
        addModels(newState, linkedType, response.linked)
      }
    }
  }
  // parse main part of request into the state, and save result as this is the main payload
  const { mappingType, resultFilter } = action.meta
  const ids = addModels(newState, mappingType, response)
  let result
  // set the result to the resultFilter if it exists
  if (resultFilter && typeof resultFilter === 'function') {
    result = resultFilter(response[mappingType])
  } else {
    result = { type: mappingType, ids: ids }
  }
  newState.pages[router.location.pathname] = result
  return newState
}

