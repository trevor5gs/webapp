import { createSelector } from 'reselect'
import { get } from 'lodash'
import { selectPathname } from './routing'
import { emptyPagination } from '../components/streams/Paginator'

// state.json.pages.xxx
export const selectPages = (state) => get(state, 'json.pages')
export const selectAllCategories = (state) => get(state, 'json.pages.all-categories')

export const selectPagesResult = (state, props) => {
  const meta = get(props, 'action.meta', {})
  const resultPath = meta.resultKey || selectPathname(state, props)
  return get(state, ['json', 'pages', resultPath], { ids: [], pagination: emptyPagination() })
}

// Memoized selectors
export const selectPage = createSelector(
  [selectPages, selectPathname], (pages, pathname) =>
    (pages && pathname ? pages[pathname] : null)
)

