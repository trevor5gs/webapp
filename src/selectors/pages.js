import { createSelector } from 'reselect'
import { get } from 'lodash'
import { selectPathname } from './routing'

// state.json.pages.xxx
export const selectPages = (state) => get(state, 'json.pages')
export const selectAllCategories = (state) => get(state, 'json.pages.all-categories')

// Memoized selectors
export const selectPage = createSelector(
  [selectPages, selectPathname], (pages, pathname) =>
    (pages && pathname ? pages[pathname] : null)
)

