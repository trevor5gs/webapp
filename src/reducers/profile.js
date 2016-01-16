import { PROFILE } from '../constants/action_types'

export function profile(state = {}, action) {
  let assetType
  switch (action.type) {
    case PROFILE.LOAD_SUCCESS:
      const { users } = action.payload.response
      return { ...state, ...users }

    case PROFILE.SAVE_SUCCESS:
    case PROFILE.AVAILABILITY_SUCCESS:
      return { ...state, ...action.payload.response }

    // Store a base64 reprensentation of the asset in `tmp` while uploading
    case PROFILE.TMP_AVATAR_CREATED:
    case PROFILE.TMP_COVER_CREATED:
      assetType = action.type === PROFILE.TMP_AVATAR_CREATED ? 'avatar' : 'coverImage'
      return {
        ...state,
        [assetType]: { ...state[assetType], ...action.payload },
      }

    // TODO: This isn't really working, it's still pulling the previous image here?
    // Once the asset is uploaded, remove `tmp` which will trigger a load of the new image
    case PROFILE.SAVE_AVATAR_SUCCESS:
    case PROFILE.SAVE_COVER_SUCCESS:
      assetType = action.type === PROFILE.SAVE_AVATAR_SUCCESS ? 'avatar' : 'coverImage'
      const assetState = { ...state, ...action.payload.response }
      delete assetState[assetType].tmp
      return assetState

    default:
      return state
  }
}

