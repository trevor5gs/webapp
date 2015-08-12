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
      message: 'Loading Communities...',
      users: []
    }
  case TYPE.LOAD_COMMUNITIES_SUCCESS:
    return {
      ...state,
      message: 'Communities Success!',
      response: action.response
    }
  case TYPE.LOAD_COMMUNITIES_FAILURE:
    return {
      ...state,
      message: 'Communities Failure!',
      error: action.error
    }

  case TYPE.LOAD_AWESOME_PEOPLE_REQUEST:
    return {
      ...state,
      message: 'Loading Awesome People...',
      users: []
    }
  case TYPE.LOAD_AWESOME_PEOPLE_SUCCESS:
    return {
      ...state,
      message: 'Awesome People Success!',
      response: action.response
    }
  case TYPE.LOAD_AWESOME_PEOPLE_FAILURE:
    return {
      ...state,
      message: 'Awesome People Failure!',
      error: action.error
    }


  default:
    return state
  }
}

