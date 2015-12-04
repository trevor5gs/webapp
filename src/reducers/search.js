import * as ACTION_TYPES from '../constants/action_types'

export function search(state = { terms: '', type: 'posts' }, action) {
  const newState = { ...state }
  switch (action.type) {
    case ACTION_TYPES.SEARCH.SAVE:
      newState.terms = action.payload.terms
      newState.type = action.payload.type
      return newState
    case ACTION_TYPES.SEARCH.CLEAR:
      // could potentially save the last type of search the user performed?
      // newState.terms = ''
      // return newState
      return { terms: '', type: 'posts' }
    default:
      return state
  }
}

