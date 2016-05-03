import * as ACTION_TYPES from '../constants/action_types'
import * as api from '../networking/api'

export function reorderBlocks(uid, delta) {
  return {
    type: ACTION_TYPES.EDITOR.REORDER_BLOCKS,
    payload: {
      delta,
      uid,
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

export function saveAsset(file, editorId) {
  return {
    type: ACTION_TYPES.EDITOR.SAVE_ASSET,
    payload: {
      editorId,
      file,
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

