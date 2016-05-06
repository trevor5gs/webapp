import { REHYDRATE } from 'redux-persist/constants'
import { cloneDeep, get } from 'lodash'
import {
  AUTHENTICATION,
  EDITOR,
  POST,
  PROFILE,
} from '../constants/action_types'
import editorMethods from '../helpers/editor_helper'

const initialState = {
  completions: {},
}

const initialEditorState = {
  collection: {},
  completions: {},
  dataKey: '',
  hasContent: false,
  hasMention: false,
  isLoading: false,
  order: [],
  shouldPersist: false,
  uid: 0,
}

function editorObject(state = initialEditorState, action) {
  let newState = cloneDeep(state)
  switch (action.type) {
    case EDITOR.ADD_BLOCK:
      return editorMethods.add({
        block: action.payload.block,
        state: newState,
        shouldCheckForEmpty: action.payload.shouldCheckForEmpty,
      })
    case EDITOR.ADD_DRAG_BLOCK:
      newState.dragBlock = action.payload.block
      return newState
    case EDITOR.ADD_EMPTY_TEXT_BLOCK:
      return editorMethods.addEmptyTextBlock(newState)
    case EDITOR.APPEND_TEXT:
      return editorMethods.appendText(newState, action.payload.text)
    case EDITOR.INITIALIZE:
      if (newState.shouldPersist) {
        return newState
      }
      return initialEditorState
    case EDITOR.POST_PREVIEW_SUCCESS:
      newState = editorMethods.removeEmptyTextBlock(newState)
      newState = editorMethods.add({
        block: { ...action.payload.response.postPreviews.body[0] },
        state: newState,
      })
      return newState
    case EDITOR.REMOVE_BLOCK:
      return editorMethods.remove({ state: newState, uid: action.payload.uid })
    case EDITOR.REMOVE_DRAG_BLOCK:
      delete newState.dragBlock
      return newState
    case EDITOR.REORDER_BLOCKS:
      return editorMethods.reorderBlocks(newState, action)
    case EDITOR.REPLACE_TEXT:
      return editorMethods.replaceText(newState, action)
    case EDITOR.RESET:
    case POST.CREATE_SUCCESS:
    case POST.UPDATE_SUCCESS:
      return editorMethods.addEmptyTextBlock({ ...initialEditorState, uid: newState.uid })
    case EDITOR.SAVE_IMAGE_SUCCESS:
      if (newState.dragBlock && newState.dragBlock.uid === action.payload.uid) {
        newState.dragBlock = {
          ...newState.dragBlock,
          data: { url: action.payload.response.url },
          isLoading: false,
        }
      } else {
        newState.collection[action.payload.uid] = {
          ...newState.collection[action.payload.uid],
          data: { url: action.payload.response.url },
          isLoading: false,
        }
      }
      return newState
    case EDITOR.TMP_IMAGE_CREATED:
      newState = editorMethods.removeEmptyTextBlock(newState)
      newState = editorMethods.add({
        block: {
          blob: action.payload.url,
          kind: 'image',
          data: {},
          isLoading: true,
        },
        state: newState,
      })
      return newState
    case EDITOR.UPDATE_BLOCK:
      return editorMethods.updateBlock(newState, action)
    default:
      return state
  }
}

export function editor(state = initialState, action) {
  const newState = cloneDeep(state)
  const editorId = get(action, 'payload.editorId')
  if (editorId) {
    newState[editorId] = editorObject(newState[editorId], action)
    if (action.type === EDITOR.INITIALIZE) {
      newState[editorId].shouldPersist = get(action, 'payload.shouldPersist', false)
    } else if (newState[editorId]) {
      newState[editorId] = editorMethods.addHasContent(newState[editorId])
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
      return editorMethods.rehydrateEditors(action.payload.editor)
    default:
      return state
  }
}

