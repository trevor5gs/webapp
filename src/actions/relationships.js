import { RELATIONSHIPS } from '../constants/action_types'
import * as MAPPING_TYPES from '../constants/mapping_types'

export function updateRelationship(userId, priority, existing) {
  return {
    type: RELATIONSHIPS.UPDATE,
    meta: { mappingType: MAPPING_TYPES.USERS },
    payload: { userId, priority, existing },
  }
}

