/* eslint-disable max-len */
/* eslint-disable no-param-reassign */
import { UPDATE_LOCATION } from 'react-router-redux'
import uniq from 'lodash.uniq'
import * as ACTION_TYPES from '../constants/action_types'
import * as MAPPING_TYPES from '../constants/mapping_types'
import commentMethods from './experience_updates/comments'
import postMethods from './experience_updates/posts'
import relationshipMethods from './experience_updates/relationships'

// adding methods and accessing them from this object
// allows the unit tests to stub methods in this module
const methods = {}
let path = '/'
let prevTerms = null
let hasLoadedFirstStream = false

function mergeModel(state, type, params) {
  if (params.id) {
    const newType = { ...state[type] }
    newType[params.id] = { ...newType[params.id], ...params }
    state[type] = newType
  }
}
methods.mergeModel = (state, type, params) =>
  mergeModel(state, type, params)

function addModels(state, type, data) {
  // add state['modelType']
  if (!state[type]) { state[type] = {} }
  const ids = []
  if (type === MAPPING_TYPES.CATEGORIES) {
    data[type].map((category, index) => {
      const newType = { ...state[type] }
      const id = index + 1
      newType[id] = category
      state[type] = newType
      ids.push(id)
    })
  } else if (data[type] && data[type].length) {
    // add arrays of models to state['modelType']['id']
    data[type].map((model) => {
      methods.mergeModel(state, type, model)
      ids.push(model.id)
    })
  } else if (data[type] && typeof data[type] === 'object') {
    // add single model objects to state['modelType']['id']
    const model = data[type]
    methods.mergeModel(state, type, model)
    ids.push(model.id)
  }
  return ids
}
methods.addModels = (state, type, data) =>
  addModels(state, type, data)

function addNewIdsToResult(state, newState) {
  if (!newState.pages) { newState.pages = {} }
  const result = newState.pages[path]
  if (!result || !result.newIds) { return state }
  result.ids = result.newIds.concat(result.ids)
  delete result.newIds
  return newState
}
methods.addNewIdsToResult = (state, newState) =>
  addNewIdsToResult(state, newState)

function setLayoutMode(action, state, newState) {
  if (!newState.pages) { newState.pages = {} }
  const result = newState.pages[path]
  if (!result || (result && result.mode === action.payload.mode)) { return state }
  result.mode = action.payload.mode
  return newState
}
methods.setLayoutMode = (action, state, newState) =>
  setLayoutMode(action, state, newState)

// parses the 'linked' node of the JSON
// api responses into the json store
function parseLinked(linked, newState) {
  if (!linked) { return }
  for (const linkedType in linked) {
    if ({}.hasOwnProperty.call(linked, linkedType)) {
      methods.addModels(newState, linkedType, linked)
    }
  }
}
methods.parseLinked = (linked, newState) =>
  parseLinked(linked, newState)

// parse main part of request into the state and
// pull out the ids as this is the main payload
function getResult(response, newState, action) {
  const { mappingType, resultFilter } = action.meta
  const ids = methods.addModels(newState, mappingType, response)
  // set the result to the resultFilter if it exists
  const result = (typeof resultFilter === 'function') ? resultFilter(response[mappingType]) : { type: mappingType, ids }
  result.pagination = action.payload.pagination
  return result
}
methods.getResult = (response, newState, action) =>
  getResult(response, newState, action)

// TODO: need to test the existingResult conditional logic!!!!
function updateResult(response, newState, action) {
  if (!newState.pages) { newState.pages = {} }
  const result = methods.getResult(response, newState, action)
  const { resultKey } = action.meta
  // the action payload pathname comes from before the fetch so that
  // we can be sure that the result is being assigned to the proper page
  const pathname = action.payload && action.payload.pathname ? action.payload.pathname : path
  const resultPath = resultKey ? `${pathname}_${resultKey}` : pathname
  const existingResult = newState.pages[resultPath]
  if (existingResult && action.type === ACTION_TYPES.LOAD_NEXT_CONTENT_SUCCESS) {
    existingResult.pagination = result.pagination
    if (existingResult.next) {
      existingResult.next.ids = uniq(existingResult.next.ids.concat(result.ids))
    } else {
      existingResult.next = result
    }
  } else if (existingResult && existingResult.ids[0] !== result.ids[0]) {
    const existingIndex = result.ids.indexOf(existingResult.ids[0])
    // only do this for top level streams, nested ones like lovers/reposters
    // should just update with the new results
    if (hasLoadedFirstStream && !resultKey && existingIndex > 0 && !pathname.match(/\/(find|search)/)) {
      existingResult.newIds = result.ids.slice(0, existingIndex)
    } else {
      // this condition should only happen if there was an existingResult
      // and the new result is more than one page away from the existingResult
      // resetting the result would clear out any of the 'old' pages in next
      // this could break down if the results were random and needed a seed
      // for pagination at which point we would want to check against the seed
      // and reset the result if the previous seed didn't match the new one
      // to avoid duplicate results
      newState.pages[resultPath] = { ...existingResult, ...result }
    }
  } else if (existingResult) {
    // keeping the existingResult pagination keeps
    // the results correct when refreshing a page
    newState.pages[resultPath] = { ...result, pagination: existingResult.pagination, next: existingResult.next }
  } else {
    newState.pages[resultPath] = result
  }
}
methods.updateResult = (response, newState, action) =>
  updateResult(response, newState, action)

function clearSearchResults(state, newState, action) {
  if (!newState.pages) return state
  const pathname = action.payload.pathname
  const existingResult = newState.pages[pathname]
  if (existingResult) {
    existingResult.ids = []
    if (existingResult.next) {
      existingResult.next.ids = []
    }
    return newState
  }
  return state
}
methods.clearSearchResults = (state, newState, action) =>
  clearSearchResults(state, newState, action)

function deleteModel(state, newState, action, mappingType) {
  const { model } = action.payload
  if (!newState[`deleted_${mappingType}`]) {
    newState[`deleted_${mappingType}`] = []
  }
  if (action.type.indexOf('_REQUEST') !== -1 || action.type.indexOf('_SUCCESS') !== -1) {
    delete newState[mappingType][model.id]
    if (newState[`deleted_${mappingType}`].indexOf(model.id) === -1) {
      newState[`deleted_${mappingType}`].push(model.id)
    }
    return newState
  } else if (action.type.indexOf('_FAILURE') !== -1) {
    // TODO: pop an alert or modal saying 'something went wrong'
    // and we couldn't delete this model?
    newState[mappingType][model.id] = model
    newState[`deleted_${mappingType}`].splice(
      newState[`deleted_${mappingType}`].indexOf(model.id),
      1
    )
    return newState
  }
  return state
}
methods.deleteModel = (state, newState, action, mappingType) =>
  deleteModel(state, newState, action, mappingType)

export default function json(state = {}, action = { type: '' }) {
  let newState = { ...state }
  // whitelist actions
  switch (action.type) {
    case ACTION_TYPES.ADD_NEW_IDS_TO_RESULT:
      return methods.addNewIdsToResult(state, newState)
    case ACTION_TYPES.COMMENT.DELETE_REQUEST:
    case ACTION_TYPES.COMMENT.DELETE_SUCCESS:
    case ACTION_TYPES.COMMENT.DELETE_FAILURE:
      return methods.deleteModel(state, newState, action, MAPPING_TYPES.COMMENTS)
    case ACTION_TYPES.LOAD_NEXT_CONTENT_SUCCESS:
    case ACTION_TYPES.LOAD_STREAM_SUCCESS:
      // fall through to parse the rest
      break
    case ACTION_TYPES.POST.CREATE_SUCCESS:
      return postMethods.addNewPost(newState, action)
    case ACTION_TYPES.POST.DELETE_REQUEST:
    case ACTION_TYPES.POST.DELETE_SUCCESS:
    case ACTION_TYPES.POST.DELETE_FAILURE:
      return methods.deleteModel(state, newState, action, MAPPING_TYPES.POSTS)
    case ACTION_TYPES.POST.LOVE_REQUEST:
    case ACTION_TYPES.POST.LOVE_FAILURE:
      return postMethods.updatePostLoves(state, newState, action)
    case ACTION_TYPES.RELATIONSHIPS.BATCH_UPDATE_INTERNAL:
      return relationshipMethods.batchUpdateRelationship(newState, action)
    case ACTION_TYPES.RELATIONSHIPS.UPDATE_INTERNAL:
    case ACTION_TYPES.RELATIONSHIPS.UPDATE_REQUEST:
    case ACTION_TYPES.RELATIONSHIPS.UPDATE_SUCCESS:
    case ACTION_TYPES.RELATIONSHIPS.UPDATE_FAILURE:
      return relationshipMethods.updateRelationship(newState, action)
    case ACTION_TYPES.SET_LAYOUT_MODE:
      return methods.setLayoutMode(action, state, newState)
    case UPDATE_LOCATION:
      path = action.payload.pathname
      if (action.payload.query.terms && prevTerms !== action.payload.query.terms) {
        newState = methods.clearSearchResults(state, newState, action)
        prevTerms = action.payload.query.terms
        return newState
      }
      return state
    default:
      return state
  }
  const { response } = action.payload
  if (!response) { return state }
  // parse the linked part of the response into the state
  methods.parseLinked(response.linked, newState)
  // parse main part of response into the state
  // and update the paging information
  // unless updateResult is false which is used for
  // user details when you want the result to be for
  // posts/following/followers/loves
  if (action && action.meta && action.meta.updateResult === false) {
    const { mappingType } = action.meta
    methods.addModels(newState, mappingType, response)
  } else {
    methods.updateResult(response, newState, action)
  }
  hasLoadedFirstStream = true
  return newState
}

// only used for testing where results get stored
export function setPath(newPath) {
  path = newPath
}

export { json, methods, path, commentMethods, postMethods, relationshipMethods }

