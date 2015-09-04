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

function addModels(state, type, data) {
  // add state['modelType']
  if (!state[type]) { state[type] = {} }
  const ids = []
  if (data[type] && data[type].length) {
    // add arrays of models to state['modelType']['id']
    data[type].map((model) => {
      state[type][model.id] = Object.assign(state[type][model.id] || {}, model)
      ids.push(model.id)
    })
  } else if (data[type] && typeof data[type] === 'object') {
    // add single model objects to state['modelType']['id']
    const model = data[type]
    state[type][model.id] = Object.assign(state[type][model.id] || {}, model)
    ids.push(model.id)
  }
  return ids
}

export function json(state = {}, action = { type: '' }) {
  const newState = Object.assign({}, state)
  if (action.type === ACTION_TYPES.LOAD_STREAM_REQUEST) {
    // clear out result since it should only be populated on success
    newState.result = {}
    return newState
  } else if (action.type !== ACTION_TYPES.LOAD_STREAM_SUCCESS) {
    return newState
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
  newState.result = {}
  newState.result[action.meta.mappingType] = addModels(newState, action.meta.mappingType, response)
  return newState
}

