import * as ACTION_TYPES from '../constants/action_types'
import * as api from '../networking/api'


export function addBlock(block, editorId) {
  return {
    type: ACTION_TYPES.EDITOR.ADD_BLOCK,
    payload: {
      block,
      editorId,
    },
  }
}

export function addDragBlock(block, editorId) {
  return {
    type: ACTION_TYPES.EDITOR.ADD_DRAG_BLOCK,
    payload: {
      block,
      editorId,
    },
  }
}

export function addEmptyTextBlock(editorId) {
  return {
    type: ACTION_TYPES.EDITOR.ADD_EMPTY_TEXT_BLOCK,
    payload: {
      editorId,
    },
  }
}

export function autoCompleteUsers(type, word) {
  return {
    type: ACTION_TYPES.EDITOR.USER_COMPLETER,
    payload: {
      endpoint: api.userAutocompleter(word),
      type,
    },
  }
}

export function initializeEditor(editorId, shouldPersist) {
  return {
    type: ACTION_TYPES.EDITOR.INITIALIZE,
    payload: {
      editorId,
      shouldPersist,
    },
  }
}

export function loadEmojis(type, word) {
  return {
    type: ACTION_TYPES.EDITOR.EMOJI_COMPLETER,
    payload: {
      endpoint: api.loadEmojis(),
      type,
      word,
    },
  }
}

export function postPreviews(embedUrl, editorId, uid) {
  return {
    type: ACTION_TYPES.EDITOR.POST_PREVIEW,
    payload: {
      body: { body: [{ kind: 'embed', data: { url: embedUrl } }] },
      editorId,
      endpoint: api.postPreviews(),
      uid,
      method: 'POST',
    },
  }
}

export function removeBlock(uid, editorId) {
  return {
    type: ACTION_TYPES.EDITOR.REMOVE_BLOCK,
    payload: {
      editorId,
      uid,
    },
  }
}

export function removeDragBlock(editorId) {
  return {
    type: ACTION_TYPES.EDITOR.REMOVE_DRAG_BLOCK,
    payload: {
      editorId,
    },
  }
}

export function reorderBlocks(uid, delta, editorId) {
  return {
    type: ACTION_TYPES.EDITOR.REORDER_BLOCKS,
    payload: {
      delta,
      editorId,
      uid,
    },
  }
}

export function resetEditor(editorId) {
  return {
    type: ACTION_TYPES.EDITOR.RESET,
    payload: {
      editorId,
    },
  }
}

export function saveAsset(file, editorId) {
  return {
    type: ACTION_TYPES.EDITOR.SAVE_ASSET,
    payload: {
      editorId,
      file,
    },
  }
}

export function updateBlock(block, uid, editorId) {
  return {
    type: ACTION_TYPES.EDITOR.UPDATE_BLOCK,
    payload: {
      block,
      editorId,
      uid,
    },
  }
}

