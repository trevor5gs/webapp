import * as TYPE from '../constants/ActionTypes'

export function test(message) {
  return {
    type: TYPE.TEST,
    message: message
  }
}

export function testAsync(message) {
  return (dispatcher) => {
    setTimeout(() => {
      dispatcher({
        type: TYPE.TEST_ASYNC,
        message: message
      })
    }, 1000)
  }
}

export function loadCommunities() {
  return {
    type: 'LOAD_COMMUNITIES',
    promise: () => fetch(`_data/communities.json`),
    payload: {}
  }
}

export function loadAwesomePeople() {
  return {
    type: 'LOAD_AWESOME_PEOPLE',
    promise: () => fetch(`_data/awesome_people.json`),
    payload: {}
  }
}

