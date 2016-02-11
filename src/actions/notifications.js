import * as ACTION_TYPES from '../constants/action_types'
import * as MAPPING_TYPES from '../constants/mapping_types'
import * as api from '../networking/api'
import * as StreamFilters from '../components/streams/StreamFilters'
import * as StreamRenderables from '../components/streams/StreamRenderables'

export function loadNotifications(params = {}) {
  return {
    type: ACTION_TYPES.LOAD_STREAM,
    payload: { endpoint: api.notifications(params), vo: {} },
    meta: {
      mappingType: MAPPING_TYPES.ACTIVITIES,
      renderStream: {
        asList: StreamRenderables.notificationList,
        asGrid: StreamRenderables.notificationList,
      },
      resultFilter: StreamFilters.notificationsFromActivities,
    },
  }
}

