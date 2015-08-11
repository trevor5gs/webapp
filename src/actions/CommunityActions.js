import { TEST, TEST_ASYNC, LOAD_COMMUNITIES_REQUEST, LOAD_COMMUNITIES_SUCCESS, LOAD_COMMUNITIES_FAILURE } from '../constants/ActionTypes'

export function test(message) {
  return {
    type: TEST,
    message: message
  }
}

export function testAsync(message) {
  return (dispatcher) => {
    setTimeout(() => {
      dispatcher({
        type: TEST_ASYNC,
        message: message
      })
    }, 1000)
  }
}

export function loadCommunities() {
  return {
    types: ['LOAD_COMMUNITIES_REQUEST', 'LOAD_COMMUNITIES_SUCCESS', 'LOAD_COMMUNITIES_FAILURE'],
    shouldCallAPI: true,
    callAPI: () => fetch(`_data/communities.json`),
    payload: {}
  };
}

