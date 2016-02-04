import * as ACTION_TYPES from '../constants/action_types'
import * as MAPPING_TYPES from '../constants/mapping_types'
import * as api from '../networking/api'
import * as StreamRenderables from '../components/streams/StreamRenderables'

export function loadPostDetail(token) {
  return {
    type: ACTION_TYPES.LOAD_STREAM,
    payload: { endpoint: api.postDetail(token), vo: {} },
    meta: {
      defaultMode: 'list',
      mappingType: MAPPING_TYPES.POSTS,
      renderStream: {
        asList: StreamRenderables.postDetail,
        asGrid: StreamRenderables.postDetail,
      },
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

export function createPost(body, repostId) {
  return {
    type: ACTION_TYPES.POST.CREATE,
    payload: {
      body: { body },
      endpoint: api.createPost(repostId),
      method: 'POST',
    },
    meta: {},
  }
}

export function uploadAsset(type, file) {
  return {
    type,
    meta: {},
    payload: {
      file,
    },
  }
}

export function temporaryPostImageCreated(b64Asset) {
  return {
    type: ACTION_TYPES.POST.TMP_IMAGE_CREATED,
    meta: {},
    payload: { url: b64Asset },
  }
}

export function savePostImage(file) {
  return dispatch => {
    const reader = new FileReader()
    reader.onloadend = () => {
      dispatch(temporaryPostImageCreated(reader.result))
    }
    dispatch(uploadAsset(ACTION_TYPES.POST.SAVE_IMAGE, file))
    reader.readAsDataURL(file)
  }
}

export function postPreviews(embedUrl) {
  return {
    type: ACTION_TYPES.POST.POST_PREVIEW,
    payload: {
      body: { body: [{ kind: 'embed', data: { url: embedUrl } }] },
      endpoint: api.postPreviews(),
      method: 'POST',
    },
  }
}

