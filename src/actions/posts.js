import * as ACTION_TYPES from '../constants/action_types'
import * as MAPPING_TYPES from '../constants/mapping_types'
import * as api from '../networking/api'
import * as StreamRenderables from '../components/streams/StreamRenderables'

export function loadPostDetail(token) {
  return {
    type: ACTION_TYPES.LOAD_STREAM,
    payload: { endpoint: api.postDetail(token), vo: {} },
    meta: {
      mappingType: MAPPING_TYPES.POSTS,
      renderStream: {
        asList: StreamRenderables.postDetail,
        asGrid: StreamRenderables.postDetail,
      },
    },
  }
}

export function loadEditablePost(post) {
  return {
    type: ACTION_TYPES.POST.EDITABLE,
    payload: { endpoint: api.editPostDetail(post.id) },
    meta: {
      mappingType: MAPPING_TYPES.POSTS,
      updateResult: false,
    },
  }
}

export function loadComments(post) {
  return {
    type: ACTION_TYPES.LOAD_STREAM,
    payload: {
      endpoint: api.commentsForPost(post),
      parentPostId: post.id,
    },
    meta: {
      defaultMode: 'list',
      mappingType: MAPPING_TYPES.COMMENTS,
      renderStream: {
        asList: StreamRenderables.commentsAsList,
        asGrid: StreamRenderables.commentsAsList,
      },
      resultKey: `${post.id}/comments`,
    },
  }
}

export function toggleComments(post, showComments) {
  return {
    type: ACTION_TYPES.POST.TOGGLE_COMMENTS,
    payload: {
      model: post,
      showComments,
    },
  }
}

export function toggleEditing(post, isEditing) {
  return {
    type: ACTION_TYPES.POST.TOGGLE_EDITING,
    payload: {
      model: post,
      isEditing,
    },
  }
}

export function toggleReposting(post, isReposting) {
  return {
    type: ACTION_TYPES.POST.TOGGLE_REPOSTING,
    payload: {
      model: post,
      isReposting,
    },
  }
}

export function lovePost(post) {
  return {
    type: ACTION_TYPES.POST.LOVE,
    payload: {
      endpoint: api.lovePost(post),
      method: 'POST',
      model: post,
    },
    meta: { mappingType: MAPPING_TYPES.LOVES },
  }
}

export function unlovePost(post) {
  return {
    type: ACTION_TYPES.POST.LOVE,
    payload: {
      endpoint: api.unlovePost(post),
      method: 'DELETE',
      model: post,
    },
    meta: {},
  }
}

export function deletePost(post) {
  return {
    type: ACTION_TYPES.POST.DELETE,
    payload: {
      endpoint: api.deletePost(post),
      method: 'DELETE',
      model: post,
    },
    meta: {},
  }
}

export function flagPost(post, kind) {
  return {
    type: ACTION_TYPES.POST.FLAG,
    payload: {
      endpoint: api.flagPost(post, kind),
      method: 'POST',
    },
    meta: {},
  }
}

export function createPost(body, editorId, repostId) {
  return {
    type: ACTION_TYPES.POST.CREATE,
    payload: {
      body: { body },
      editorId,
      endpoint: api.createPost(repostId),
      method: 'POST',
    },
    meta: {},
  }
}

export function createComment(body, editorId, postId) {
  return {
    type: ACTION_TYPES.COMMENT.CREATE,
    payload: {
      body: { body },
      editorId,
      endpoint: api.createComment(postId),
      method: 'POST',
      postId: editorId,
    },
    meta: {},
  }
}

export function updatePost(post, body) {
  return {
    type: ACTION_TYPES.POST.UPDATE,
    payload: {
      body: { body },
      endpoint: api.updatePost(post),
      method: 'PATCH',
    },
    meta: {},
  }
}

export function uploadAsset(type, file, editorId) {
  return {
    type,
    meta: {},
    payload: {
      editorId,
      file,
    },
  }
}

export function temporaryPostImageCreated(b64Asset, editorId) {
  return {
    type: ACTION_TYPES.POST.TMP_IMAGE_CREATED,
    meta: {},
    payload: { url: b64Asset, editorId },
  }
}

export function savePostImage(file, editorId) {
  return dispatch => {
    const reader = new FileReader()
    reader.onloadend = () => {
      dispatch(temporaryPostImageCreated(reader.result, editorId))
    }
    dispatch(uploadAsset(ACTION_TYPES.POST.SAVE_IMAGE, file, editorId))
    reader.readAsDataURL(file)
  }
}

export function postPreviews(embedUrl, editorId) {
  return {
    type: ACTION_TYPES.POST.POST_PREVIEW,
    payload: {
      body: { body: [{ kind: 'embed', data: { url: embedUrl } }] },
      editorId,
      endpoint: api.postPreviews(),
      method: 'POST',
    },
  }
}

export function autoCompleteUsers(type, word) {
  return {
    type: ACTION_TYPES.POST.AUTO_COMPLETE,
    payload: {
      endpoint: api.userAutocompleter(word),
      type,
    },
  }
}

export function loadEmojis(type, word) {
  return {
    type: ACTION_TYPES.EMOJI.LOAD,
    payload: {
      endpoint: api.loadEmojis(),
      type,
      word,
    },
  }
}

