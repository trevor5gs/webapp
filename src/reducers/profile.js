import { PROFILE } from '../constants/action_types'

// need to hydrate this thing with current user at login
const initialState = {
  payload: {
  },
}

export function profile(state = initialState, action) {
  let response
  let mergedAsset
  let key
  switch (action.type) {
    case PROFILE.AVAILABILITY_SUCCESS:
      return { ...state, ...action.payload.response }
    case PROFILE.LOAD_REQUEST:
    case PROFILE.LOAD_SUCCESS:
    case PROFILE.SAVE_REQUEST:
    case PROFILE.SAVE_SUCCESS:
      response = action.payload.response ? action.payload.response : {}
      return {
        availability: state.availability,
        type: action.type,
        meta: action.meta,
        error: action.error,
        payload: {
          ...state.payload,
          ...response,
        },
      }

    // Store a base64 reprensentation of the asset as `tmp` while uploading
    case PROFILE.TMP_AVATAR_CREATED:
    case PROFILE.TMP_COVER_CREATED:
      key = action.type === PROFILE.TMP_AVATAR_CREATED ? 'avatar' : 'coverImage'
      mergedAsset = {
        ...state.payload.users[key],
        ...action.payload,
      }
      return {
        availability: state.availability,
        type: action.type,
        meta: action.meta,
        error: action.error,
        payload: {
          linked: state.payload.linked,
          users: {
            ...state.payload.users,
            ...{ [key]: mergedAsset },
          },
        },
      }

    // Once the asset is uploaded null out the `tmp` base64 asset and let the
    // image do it's thing.
    case PROFILE.SAVE_AVATAR_SUCCESS:
    case PROFILE.SAVE_COVER_SUCCESS:
      key = action.type === PROFILE.SAVE_AVATAR_SUCCESS ? 'avatar' : 'coverImage'
      response = action.payload.response
      if (!response && !response[key]) {
        return state
      }
      // TODO: Not working as expected on the return value in the action. Might
      // have to do with workers? It's always one behind.
      mergedAsset = {
        ...response[key],
        ...{ tmp: null },
      }
      return {
        availability: state.availability,
        type: action.type,
        meta: action.meta,
        error: action.error,
        payload: {
          linked: state.payload.linked,
          users: {
            ...response,
            ...{ [key]: mergedAsset },
          },
        },
      }
    default:
      return state
  }
}

