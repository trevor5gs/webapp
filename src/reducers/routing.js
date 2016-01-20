import { UPDATE_PATH } from 'redux-simple-router'

const INIT_PATH = '@@router/INIT_PATH'
const initialState = {
  changeId: 1,
  path: undefined,
  state: undefined,
  replace: false,
}

export function routing(state = initialState, { type, payload }) {
  if (type === INIT_PATH || type === UPDATE_PATH) {
    return Object.assign({}, state, {
      path: payload.path,
      changeId: state.changeId + (payload.avoidRouterUpdate ? 0 : 1),
      state: payload.state,
      replace: payload.replace,
      previousPath: state.path,
    })
  }
  return state
}
