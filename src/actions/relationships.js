import { RELATIONSHIPS } from '../constants/action_types'
import * as MAPPING_TYPES from '../constants/mapping_types'
import { getAPIPath } from '../networking/api'

export function updateRelationship(userId, priority, existing, internal = false) {
  const action = internal ?
    {
      type: RELATIONSHIPS.UPDATE_INTERNAL,
      meta: { mappingType: MAPPING_TYPES.RELATIONSHIPS },
      payload: { userId, priority, existing },
    } :
    {
      type: RELATIONSHIPS.UPDATE,
      meta: { mappingType: MAPPING_TYPES.RELATIONSHIPS },
      payload: {
        endpoint: {
          path: `${getAPIPath('users')}/${userId}/add/${priority}`,
        },
        existing,
        method: 'POST',
        priority,
        userId,
      },
    }
  return action
}

