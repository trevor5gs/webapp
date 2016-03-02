/* eslint-disable no-param-reassign */
import * as ACTION_TYPES from '../../constants/action_types'
import * as MAPPING_TYPES from '../../constants/mapping_types'
import { RELATIONSHIP_PRIORITY } from '../../constants/relationship_types'
import { methods as jsonMethods } from '../json'

const methods = {}

function removeIdFromDeletedArray(newState, type, id) {
  const delArr = newState[`deleted_${type}`]
  if (delArr) {
    const index = delArr.indexOf(`${id}`)
    if (index > -1) {
      delArr.splice(index, 1)
    }
  }
  return newState
}
methods.removeIdFromDeletedArray = (newState, id, type) =>
  removeIdFromDeletedArray(newState, id, type)

function updateFollowersCountAndPriority(newState, action) {
  // on success just return the owner subject mapped back on users
  if (action.type === ACTION_TYPES.RELATIONSHIPS.UPDATE_SUCCESS) {
    const { response } = action.payload
    const { owner, subject } = response
    if (owner) { newState[MAPPING_TYPES.USERS][owner.id] = owner }
    if (subject) { newState[MAPPING_TYPES.USERS][subject.id] = subject }
    return newState
  }
  const { userId, priority } = action.payload
  const user = newState[MAPPING_TYPES.USERS][userId]
  const prevPriority = user.relationshipPriority
  let delta = 0
  if (prevPriority === RELATIONSHIP_PRIORITY.BLOCK) {
    // update blockedCount
    jsonMethods.updateUserCount(newState, userId, 'blockedCount', -1)
    // remove the user from the deleted user ids array
    methods.removeIdFromDeletedArray(newState, MAPPING_TYPES.USERS, userId)
    // add back all of their posts
    methods.addBackItemsForAuthor(newState, MAPPING_TYPES.POSTS, userId)
    // add back all of their comments
    methods.addBackItemsForAuthor(newState, MAPPING_TYPES.COMMENTS, userId)
  } else if (prevPriority === RELATIONSHIP_PRIORITY.MUTE) {
    jsonMethods.updateUserCount(newState, userId, 'mutedCount', -1)
  }
  switch (priority) {
    case RELATIONSHIP_PRIORITY.FRIEND:
    case RELATIONSHIP_PRIORITY.NOISE:
      if (prevPriority !== RELATIONSHIP_PRIORITY.FRIEND &&
          prevPriority !== RELATIONSHIP_PRIORITY.NOISE) {
        delta = 1
      }
      break
    case RELATIONSHIP_PRIORITY.BLOCK:
      jsonMethods.updateUserCount(newState, userId, 'blockedCount', 1)
      break
    case RELATIONSHIP_PRIORITY.MUTE:
      jsonMethods.updateUserCount(newState, userId, 'mutedCount', 1)
      break
    default:
      if (prevPriority === RELATIONSHIP_PRIORITY.FRIEND ||
          prevPriority === RELATIONSHIP_PRIORITY.NOISE) {
        delta = -1
      }
      break
  }
  jsonMethods.updateUserCount(newState, userId, 'followersCount', delta)
  // update local user
  jsonMethods.mergeModel(
    newState,
    MAPPING_TYPES.USERS,
    {
      id: userId,
      relationshipPriority: priority,
    }
  )
  return newState
}
methods.updateFollowersCountAndPriority = (newState, action) =>
  updateFollowersCountAndPriority(newState, action)


function addBackItemsForAuthor(newState, mappingType, authorId) {
  for (const itemId in newState[mappingType]) {
    if (newState[mappingType].hasOwnProperty(itemId)) {
      const item = newState[mappingType][itemId]
      if (item.hasOwnProperty('authorId') && item.authorId === authorId) {
        methods.removeIdFromDeletedArray(newState, mappingType, itemId)
      }
    }
  }
  return newState
}
methods.addBackItemsForAuthor = (newState, mappingType, authorId) =>
  addBackItemsForAuthor(newState, mappingType, authorId)

function removeItemsForAuthor(newState, mappingType, authorId) {
  for (const itemId in newState[mappingType]) {
    if (newState[mappingType].hasOwnProperty(itemId)) {
      const item = newState[mappingType][itemId]
      if (item.hasOwnProperty('authorId') && item.authorId === authorId) {
        const action = {
          type: '_REQUEST',
          payload: {
            model: newState[mappingType][itemId],
          },
        }
        newState = jsonMethods.deleteModel(null, newState, action, mappingType)
      }
    }
  }
  return newState
}
methods.removeItemsForAuthor = (newState, mappingType, authorId) =>
  removeItemsForAuthor(newState, mappingType, authorId)

function updateRelationship(newState, action) {
  const { userId, priority } = action.payload
  methods.updateFollowersCountAndPriority(newState, action)
  // remove the user from the store
  if (priority === RELATIONSHIP_PRIORITY.BLOCK) {
    // delete the user
    const userAction = {
      type: '_REQUEST',
      payload: {
        model: newState[MAPPING_TYPES.USERS][userId],
      },
    }
    jsonMethods.deleteModel(null, newState, userAction, MAPPING_TYPES.USERS)
    // delete all of their posts
    methods.removeItemsForAuthor(newState, MAPPING_TYPES.POSTS, userId)
    // delete all of their comments
    methods.removeItemsForAuthor(newState, MAPPING_TYPES.COMMENTS, userId)
  }
  return newState
}
methods.updateRelationship = (newState, action) =>
  updateRelationship(newState, action)

function batchUpdateRelationship(newState, action) {
  const { priority, userIds } = action.payload
  for (const id of userIds) {
    jsonMethods.mergeModel(
      newState,
      MAPPING_TYPES.USERS,
      {
        id,
        relationshipPriority: priority,
      }
    )
  }
  return newState
}
methods.batchUpdateRelationship = (newState, action) =>
  batchUpdateRelationship(newState, action)

export default methods

