/* eslint-disable no-param-reassign */
import * as ACTION_TYPES from '../../constants/action_types'
import * as MAPPING_TYPES from '../../constants/mapping_types'
import { RELATIONSHIP_PRIORITY } from '../../constants/relationship_types'
import * as jsonReducer from '../../reducers/json'

const methods = {}

methods.removeIdFromDeletedArray = (newState, type, id) => {
  const delArr = newState[`deleted_${type}`]
  if (delArr) {
    const index = delArr.indexOf(`${id}`)
    if (index > -1) {
      delArr.splice(index, 1)
    }
  }
  return newState
}

methods.relationshipUpdateSuccess = (newState, action) => {
  const { response } = action.payload
  const { owner, subject } = response
  if (owner) { newState[MAPPING_TYPES.USERS][owner.id] = owner }
  if (subject) { newState[MAPPING_TYPES.USERS][subject.id] = subject }
  return newState
}

methods.addItemsForAuthor = (newState, mappingType, authorId) => {
  Object.keys(newState[mappingType] || {}).forEach((itemId) => {
    const item = newState[mappingType][itemId]
    if ({}.hasOwnProperty.call(item, 'authorId') && item.authorId === authorId) {
      methods.removeIdFromDeletedArray(newState, mappingType, itemId)
    }
  })
  return newState
}

methods.removeItemsForAuthor = (newState, mappingType, authorId) => {
  Object.keys(newState[mappingType] || {}).forEach((itemId) => {
    const item = newState[mappingType][itemId]
    if ({}.hasOwnProperty.call(item, 'authorId') && item.authorId === authorId) {
      const action = {
        type: '_REQUEST',
        payload: {
          model: newState[mappingType][itemId],
        },
      }
      jsonReducer.methods.deleteModel(null, newState, action, mappingType)
    }
  })
  return newState
}

methods.blockUser = (newState, userId) => {
  // update blockedCount
  jsonReducer.methods.updateUserCount(newState, userId, 'blockedCount', 1)
  // delete the user
  const userAction = {
    type: '_REQUEST',
    payload: {
      model: newState[MAPPING_TYPES.USERS][userId],
    },
  }
  jsonReducer.methods.deleteModel(null, newState, userAction, MAPPING_TYPES.USERS)
  // delete all of their posts
  methods.removeItemsForAuthor(newState, MAPPING_TYPES.POSTS, userId)
  // delete all of their comments
  methods.removeItemsForAuthor(newState, MAPPING_TYPES.COMMENTS, userId)
}

methods.unblockUser = (newState, userId) => {
  // update blockedCount
  jsonReducer.methods.updateUserCount(newState, userId, 'blockedCount', -1)
  // remove the user from the deleted user ids array
  methods.removeIdFromDeletedArray(newState, MAPPING_TYPES.USERS, userId)
  // add back all of their posts
  methods.addItemsForAuthor(newState, MAPPING_TYPES.POSTS, userId)
  // add back all of their comments
  methods.addItemsForAuthor(newState, MAPPING_TYPES.COMMENTS, userId)
}

methods.updateRelationship = (newState, action) => {
  // on success just return the owner subject mapped back on users
  if (action.type === ACTION_TYPES.RELATIONSHIPS.UPDATE_SUCCESS) {
    return methods.relationshipUpdateSuccess(newState, action)
  }
  const { userId, priority } = action.payload
  const user = newState[MAPPING_TYPES.USERS][userId]
  const prevPriority = user.relationshipPriority
  switch (prevPriority) {
    case RELATIONSHIP_PRIORITY.BLOCK:
      methods.unblockUser(newState, userId)
      break
    case RELATIONSHIP_PRIORITY.MUTE:
      jsonReducer.methods.updateUserCount(newState, userId, 'mutedCount', -1)
      break
    case RELATIONSHIP_PRIORITY.FRIEND:
    case RELATIONSHIP_PRIORITY.NOISE:
      if (priority !== RELATIONSHIP_PRIORITY.FRIEND &&
          priority !== RELATIONSHIP_PRIORITY.NOISE) {
        jsonReducer.methods.updateUserCount(newState, userId, 'followersCount', -1)
      }
      break
    default:
      break
  }
  switch (priority) {
    case RELATIONSHIP_PRIORITY.FRIEND:
    case RELATIONSHIP_PRIORITY.NOISE:
      if (prevPriority !== RELATIONSHIP_PRIORITY.FRIEND &&
          prevPriority !== RELATIONSHIP_PRIORITY.NOISE) {
        jsonReducer.methods.updateUserCount(newState, userId, 'followersCount', 1)
      }
      break
    case RELATIONSHIP_PRIORITY.BLOCK:
      methods.blockUser(newState, userId)
      break
    case RELATIONSHIP_PRIORITY.MUTE:
      jsonReducer.methods.updateUserCount(newState, userId, 'mutedCount', 1)
      break
    default:
      break
  }
  // update local user
  jsonReducer.methods.mergeModel(
    newState,
    MAPPING_TYPES.USERS,
    {
      id: userId,
      relationshipPriority: priority,
    }
  )
  return newState
}

methods.batchUpdateRelationship = (newState, action) => {
  const { priority, userIds } = action.payload
  userIds.forEach((id) => {
    jsonReducer.methods.mergeModel(
      newState,
      MAPPING_TYPES.USERS,
      {
        id,
        relationshipPriority: priority,
      }
    )
  })
  return newState
}

export { methods as default, jsonReducer }

