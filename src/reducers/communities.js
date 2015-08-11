import * as TYPE from '../constants/ActionTypes'

export default function communities(state = {}, action) {
  switch (action.type) {
  case TYPE.TEST:
  case TYPE.TEST_ASYNC:
      return {
        ...state,
        message : action.message,
      }

  case TYPE.LOAD_COMMUNITIES_REQUEST:
    return {
      ...state,
      message: 'Loading...',
      users: []
    }
  case TYPE.LOAD_COMMUNITIES_SUCCESS:
    return {
      ...state,
      message: 'Success!',
      response: action.response
    }
  case TYPE.LOAD_COMMUNITIES_FAILURE:
    return {
      ...state,
      message: 'Failure!',
      error: action.error
    }
  default:
    return state
  }
}

