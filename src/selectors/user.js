import { createSelector } from 'reselect'
import { get } from 'lodash'

// props.user.xxx
export const selectPropsUser = (state, props) => get(props, 'user')
export const selectPropsUserId = (state, props) => get(props, 'user.id')

// state.json.user.xxx
export const selectUsers = (state) => get(state, 'json.users')

// Memoized Selectors
export const selectUser = createSelector(
  [selectUsers, selectPropsUserId], (users, userId) =>
    users[userId]
)

export const selectRelationshipPriority = createSelector(
  [selectUser], (user) => get(user, 'relationshipPriority')
)

