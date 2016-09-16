import { createSelector } from 'reselect'
import { get } from 'lodash'
import { selectPathname } from './routing'
import * as MAPPING_TYPES from '../constants/mapping_types'
import { emptyPagination } from '../components/streams/Paginator'

const selectJson = state => state.json

// props.xxx
const selectMeta = (state, props) => get(props, 'action.meta', {})

// state.stream.xxx
export const selectStreamType = state => get(state, 'stream.type')

// state.stream.meta.xxx
export const selectStreamMappingType = state => get(state, 'stream.meta.mappingType')

// state.stream.payload.xxx
export const selectStreamPostIdOrToken = state => get(state, 'stream.payload.postIdOrToken')

const selectStreamResult = (state, props) => {
  const meta = selectMeta(state, props)
  const resultPath = meta.resultKey || selectPathname(state)
  return get(state, ['json', 'pages', resultPath], { ids: [], pagination: emptyPagination() })
}

const selectStreamResultPath = (state, props) => {
  const meta = selectMeta(state, props)
  return meta.resultKey || selectPathname(state)
}

const selectStreamDeletions = (state, props) => {
  const meta = selectMeta(state, props)
  const resultPath = meta.resultKey || selectPathname(state)
  const result = get(state.json, ['pages', resultPath], { ids: [] })
  return (result && result.type === meta.mappingType) ||
    (meta.resultFilter && result.type !== meta.mappingType)
}

const selectPagingPath = (state, props) => get(props, 'action.payload.endpoint.pagingPath')

// Memoized selectors
// TODO: We need to test this :(
export const makeSelectStreamProps = () =>
  createSelector(
    [
      selectStreamResult,
      selectStreamResultPath,
      selectStreamDeletions,
      selectJson,
      selectPathname,
      selectPagingPath,
    ],
    (
      result,
      resultPath,
      shouldRemoveDeletions,
      json,
      path,
      pagingPath
    ) => {
      const renderObj = { data: [], nestedData: [] }
      if (result && result.type === MAPPING_TYPES.NOTIFICATIONS) {
        renderObj.data = renderObj.data.concat(result.ids)
        if (result.next) {
          renderObj.data = renderObj.data.concat(result.next.ids)
        }
      } else if (shouldRemoveDeletions) {
        const delTypes = json[`deleted_${result.type}`]
        // don't filter out blocked ids if we are in settings
        // since you can unblock/unmute them from here
        for (const id of result.ids) {
          const model = get(json, [result.type, id])
          if (model && (path === '/settings' || (!delTypes || delTypes.indexOf(id) === -1))) {
            renderObj.data.push(model)
          }
        }
        if (result.next) {
          const nDelTypes = json[`deleted_${result.next.type}`]
          const dataProp = pagingPath ? 'nestedData' : 'data'
          for (const nextId of result.next.ids) {
            const model = get(json, [result.next.type, nextId])
            if (model && (path === '/settings' ||
                (!nDelTypes || nDelTypes.indexOf(nextId) === -1))) {
              renderObj[dataProp].push(model)
            }
          }
        }
      }
      return { renderObj, result, resultPath }
    }
  )
