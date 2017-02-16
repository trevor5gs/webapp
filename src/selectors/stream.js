import Immutable from 'immutable'
import { createSelector } from 'reselect'
import get from 'lodash/get'
import { selectPathname } from './routing'
import { selectJson } from './store'
import { emptyPagination } from '../reducers/json'

// props.xxx
const selectMeta = (state, props) => get(props, 'action.meta', {})

// state.stream.xxx
export const selectStreamType = state => state.stream.get('type')

// state.stream.meta.xxx
export const selectStreamMappingType = state => state.stream.getIn(['meta', 'mappingType'])

// state.stream.payload.xxx
export const selectStreamPostIdOrToken = state => state.stream.getIn(['payload', 'postIdOrToken'])

const selectStreamResult = (state, props) => {
  const meta = selectMeta(state, props)
  const resultPath = meta.resultKey || selectPathname(state)
  return state.json.getIn(['pages', resultPath], Immutable.Map({ ids: Immutable.List(), pagination: emptyPagination() }))
}

const selectStreamResultPath = (state, props) => {
  const meta = selectMeta(state, props)
  return meta.resultKey || selectPathname(state)
}

const selectStreamDeletions = (state, props) => {
  const meta = selectMeta(state, props)
  const resultPath = meta.resultKey || selectPathname(state)
  const result = state.json.getIn(['pages', resultPath], Immutable.Map({ ids: [] }))
  return (result.get('type') === meta.mappingType) ||
    (meta.resultFilter && result.get('type') !== meta.mappingType)
}

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
    ],
    (
      result,
      resultPath,
      shouldRemoveDeletions,
      json,
      path,
    ) => {
      let ids = result.get('ids')
      if (shouldRemoveDeletions) {
        // don't filter out blocked ids if we are in settings
        // since you can unblock/unmute them from here
        const delTypes = json.get(`deleted_${result.get('type')}`)
        ids = result.get('ids').filter((value, key) =>
          path === '/settings' || !delTypes || !delTypes.includes(key),
        )
      }
      return { result: result.set('ids', ids), resultPath }
    },
  )

