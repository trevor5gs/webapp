import * as MAPPING_TYPES from '../../constants/mapping_types'

// the export methods need to return an object like:
// { type: posts, ids: [1, 2, 3] }
export function mostRecentPostsFromUsers(users) {
  const result = { type: MAPPING_TYPES.POSTS, ids: [] }
  result.ids = users.map((user) => {
    return user.links.mostRecentPost.id
  })
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

