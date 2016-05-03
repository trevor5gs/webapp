/* eslint-disable no-param-reassign */

import { get } from 'lodash'
import {
  AUTHENTICATION,
  EDITOR,
  POST,
  PROFILE,
} from '../constants/action_types'
import editorMethods from '../helpers/editor_helper'

const initialState = {}

const initialEditorState = {
  collection: {
    0: {
      kind: 'text',
      uid: 0,
      data: '',
    },
  },
  completions: {},
  dataKey: '',
  hasContent: false,
  isSubmitDisabled: false,
  order: [0],
  uid: 0,
}

// TODO:
// dragging
// has content
// image loaders
// cancel
// clear block x button
// paste of images/text
// initializing block and repost content
// persisting only the main editor
// make sure embeds work
// autocompleters
//

function editorObject(state = initialEditorState, action) {
  let newState = { ...state }
  const { collection, order } = newState
  const textBlocks = order.filter((orderUid) => collection[orderUid].kind === 'text')
  const lastTextBlock = collection[textBlocks[textBlocks.length - 1]]

  switch (action.type) {
    case EDITOR.APPEND_TEXT:
      if (lastTextBlock) {
        lastTextBlock.data += action.payload.text
        collection[lastTextBlock.uid] = lastTextBlock
      }
      return newState
    case EDITOR.REORDER_BLOCKS:
      return editorMethods.reorderBlocks(newState, action)
    case EDITOR.TMP_IMAGE_CREATED:
      newState = editorMethods.removeEmptyTextBlock(newState)
      newState = editorMethods.add({
        block: {
          kind: 'image',
          data: { url: action.payload.url },
          isLoading: true,
        },
        state: newState,
      })
      return newState
    case EDITOR.POST_PREVIEW_SUCCESS:
    case EDITOR.SAVE_IMAGE_SUCCESS:
      newState.collection[action.payload.uid] = {
        ...newState.collection[action.payload.uid],
        data: { url: action.payload.response.url },
        isLoading: false,
      }
      return newState
    case EDITOR.PERSIST:
      return { ...state, ...action.payload }
    case EDITOR.UPDATE_DRAG_BLOCK:
      return editorMethods.updateDragBlock(newState, action)
    case POST.CREATE_SUCCESS:
      return {}
    // case REHYDRATE:
    //   for (const editor in action.payload.editor) {
    //     // TODO: only keep ones that should persist
    //   }
    default:
      return state
  }
}

export function editor(state = initialState, action) {
  const newState = { ...state }
  const editorId = get(action, 'payload.editorId')
  if (editorId) {
    newState[editorId] = editorObject(newState[editorId], action)
    if (action.type === 'INIT_EDITOR_ID') {
      newState[editorId].shouldPersist = get(action, 'payload.shouldPersist', false)
    }
    newState[editorId] = editorMethods.addDataKey(newState[editorId])
    return newState
  } else if (action.type === AUTHENTICATION.LOGOUT ||
             action.type === PROFILE.DELETE_SUCCESS) {
    return { ...initialState }
  }
  return state
}

