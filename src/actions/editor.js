import * as ACTION_TYPES from '../constants/action_types'
import * as api from '../networking/api'

export function autoCompleteUsers(type, word) {
  return {
    type: ACTION_TYPES.EDITOR.USER_COMPLETER,
    payload: {
      endpoint: api.userAutocompleter(word),
      type,
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

export function saveAsset(file, editorId) {
  return {
    type: ACTION_TYPES.EDITOR.SAVE_ASSET,
    payload: {
      editorId,
      file,
    },
  }
}

export function updateDragBlock(block, uid, editorId) {
  return {
    type: ACTION_TYPES.EDITOR.UPDATE_DRAG_BLOCK,
    payload: {
      block,
      editorId,
      uid,
    },
  }
}

