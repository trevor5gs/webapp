import * as MAPPING_TYPES from '../../constants/mapping_types'

// the export methods need to return an object like:
// { type: posts, ids: [1, 2, 3] }
export function mostRecentPostsFromUsers(users) {
  const result = { type: MAPPING_TYPES.POSTS, ids: [] }
  for (const user of users) {
    if (user.links.mostRecentPost) {
      result.ids.push(user.links.mostRecentPost.id)
    }
  }
  return result
}

export function postsFromActivities(activities) {
  const result = { type: MAPPING_TYPES.POSTS, ids: [] }
  for (const activity of activities) {
    if (activity.links.subject.type === MAPPING_TYPES.POSTS) {
      result.ids.push(activity.links.subject.id)
    }
  }
  return result
}

export function postsFromLoves(loves) {
  const result = { type: MAPPING_TYPES.POSTS, ids: [] }
  for (const love of loves) {
    result.ids.push(love.postId)
  }
  return result
}

export function notificationsFromActivities(activities) {
  return { type: MAPPING_TYPES.NOTIFICATIONS, ids: activities }
}

