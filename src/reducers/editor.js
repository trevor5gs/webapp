import { REHYDRATE } from 'redux-persist/constants'
import { cloneDeep, get } from 'lodash'
import { AUTHENTICATION, EDITOR, PROFILE } from '../constants/action_types'
import editorMethods from '../helpers/editor_helper'

const initialState = {
  completions: {},
}

export function editor(state = initialState, action) {
  const newState = cloneDeep(state)
  const editorId = get(action, 'payload.editorId')
  if (editorId) {
    newState[editorId] = editorMethods.getEditorObject(newState[editorId], action)
    if (action.type === EDITOR.INITIALIZE) {
      newState[editorId].shouldPersist = get(action, 'payload.shouldPersist', false)
    } else if (newState[editorId]) {
      newState[editorId] = editorMethods.addHasContent(newState[editorId])
      newState[editorId] = editorMethods.addHasMedia(newState[editorId])
      newState[editorId] = editorMethods.addHasMention(newState[editorId])
      newState[editorId] = editorMethods.addIsLoading(newState[editorId])
    }
    return newState
  }
  switch (action.type) {
    case AUTHENTICATION.LOGOUT:
    case PROFILE.DELETE_SUCCESS:
      return { ...initialState }
    case EDITOR.CLEAR_AUTO_COMPLETERS:
      delete newState.completions
      return newState
    case EDITOR.EMOJI_COMPLETER_SUCCESS:
    case EDITOR.USER_COMPLETER_SUCCESS:
      return editorMethods.addCompletions(newState, action)
    case REHYDRATE:
      if (action.payload.editor) {
        return editorMethods.rehydrateEditors(action.payload.editor)
      }
      return state
    default:
      return state
  }
}

export { editorMethods, initialState }

