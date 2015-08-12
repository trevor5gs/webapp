import * as TYPE from '../constants/action_types'

export function userData(state = {}, action) {
  switch (action.type) {
  case TYPE.LOAD_COMMUNITIES_REQUEST:
    return {
      ...state,
      payload: { message: 'Loading Communities...' }
    }
  case TYPE.LOAD_COMMUNITIES_SUCCESS:
    return {
      ...state,
      payload: { message: 'Communities Success!', response: action.payload.response }
    }
  case TYPE.LOAD_COMMUNITIES_FAILURE:
    return {
      ...state,
      payload: { message: 'Communities Failure!' },
      error: action.error
    }

  case TYPE.LOAD_AWESOME_PEOPLE_REQUEST:
    return {
      ...state,
      payload: { message: 'Loading Awesome People...' }
    }
  case TYPE.LOAD_AWESOME_PEOPLE_SUCCESS:
    return {
      ...state,
      payload: { message: 'Awesome People Success!', response: action.payload.response }
    }
  case TYPE.LOAD_AWESOME_PEOPLE_FAILURE:
    return {
      ...state,
      payload: { message: 'Awesome People Failure!' },
      error: action.error
    }

  default:
    return state
  }
}

