import { UPDATE_LOCATION } from 'react-router-redux'
import { SET_LAYOUT_MODE } from '../constants/action_types'


let location = {}
// order matters for matching routes
const initialState = {
  modes: [
    { label: 'discover', mode: 'grid', regex: /\/discover|\/explore/ },
    { label: 'following', mode: 'grid', regex: /\/following/ },
    { label: 'invitations', mode: 'grid', regex: /\/invitations/ },
    { label: 'search', mode: 'grid', regex: /\/search|\/find/ },
    { label: 'starred', mode: 'list', regex: /\/starred/ },
    { label: 'posts', mode: 'list', regex: /\/[\w\-]+\/post\/.+/ },
    { label: 'users', mode: 'list', regex: /\/[\w\-]+/ },
  ],
}

export function findLayoutMode(modes) {
  for (const mode of modes) {
    if (location.pathname.match(mode.regex)) {
      return mode
    }
  }
  return null
}

export function gui(state = initialState, action = { type: '' }) {
  const newState = { ...state }
  let mode = null
  switch (action.type) {
    case SET_LAYOUT_MODE:
      mode = findLayoutMode(newState.modes)
      if (mode.mode === action.payload.mode) return state
      mode.mode = action.payload.mode
      return newState
    case UPDATE_LOCATION:
      location = action.payload
      return state
    default:
      return state
  }
}

