import { createSelector } from 'reselect'
import { get } from 'lodash'
import { selectParamsUsername } from './params'
import * as MAPPING_TYPES from '../constants/mapping_types'
import { findModel } from '../helpers/json_helper'

const selectJson = state => get(state, 'json')

// props.user.xxx
export const selectPropsUser = (state, props) => get(props, 'user')
export const selectPropsUserId = (state, props) => get(props, 'user.id')

// state.json.users.xxx
export const selectUsers = state => get(state, 'json.users')

// Memoized selectors
export const selectUser = createSelector(
  [selectUsers, selectPropsUserId], (users, userId) =>
    users[userId]
)

export const selectUserFromPropsUserId = createSelector(
  [selectJson, selectPropsUserId], (json, userId) =>
    (userId ? json[MAPPING_TYPES.USERS][userId] : null)
)

export const selectUserFromUsername = createSelector(
  [selectJson, selectParamsUsername], (json, username) =>
    findModel(json, { collection: MAPPING_TYPES.USERS, findObj: { username } })
)

export const selectRelationshipPriority = createSelector(
  [selectUser], user => get(user, 'relationshipPriority')
)

