import { LOAD_COMMUNITIES_REQUEST, LOAD_COMMUNITIES_SUCCESS, LOAD_COMMUNITIES_FAILURE } from '../constants/ActionTypes';

export default function communities(state = 'YO', action) {
  switch (action.type) {
  case LOAD_COMMUNITIES_REQUEST:
    console.log('requesting')
    return LOAD_COMMUNITIES_REQUEST
  case LOAD_COMMUNITIES_SUCCESS:
    console.log('success', action.response.json(), action)
    return state
  case LOAD_COMMUNITIES_FAILURE:
    console.log('failure', action.error.json(), action)
    return LOAD_COMMUNITIES_FAILURE
  default:
    return state;
  }
}
