import { createSelector } from 'reselect'
import { get, upperFirst } from 'lodash'
import * as MAPPING_TYPES from '../constants/mapping_types'
import { findModel } from '../helpers/json_helper'

const PAGING_BLACKLIST = [
  /^\/enter\b/,
  /^\/forgot-password\b/,
  /^\/join\b/,
  /^\/signup\b/,
  /^\/following$/,
  /^\/starred$/,
  /^\/notifications\b/,
  /^\/settings\b/,
  /^\/onboarding\b/,
  /^\/invitations\b/,
]

export function sortCategories(a, b) {
  if (a.order < b.order) {
    return -1
  } else if (a.order > b.order) {
    return 1
  }
  return 0
}

// Top level state and props
const selectJSON = (state) => state.json

// props.params.xxx
const selectParamsType = (state, props) => get(props, 'params.type')
const selectParamsToken = (state, props) => {
  const token = get(props, 'params.token')
  return token ? token.toLowerCase() : undefined
}

// props.location.xxx
const selectLocationPathname = (state, props) => get(props, 'location.pathname')

// state.json.xxx
const selectPages = (state) => get(state, 'json.pages')
const selectPagingResult = (state, props) => state.json.pages[props.location.pathname]
const selectAllCategories = (state) => get(state, 'json.pages.all-categories')
const selectCategoryCollection = (state) => get(state, 'json.categories')


// Memoized Selectors
export const selectPagination = createSelector(
  [selectJSON, selectPages, selectLocationPathname, selectPagingResult, selectParamsToken],
  (json, pages, pathname, pagingResult, paramsToken) => {
    let result = pagingResult
    const isPagingEnabled = !(PAGING_BLACKLIST.every((re) => re.test(pathname)))
    if (pages && isPagingEnabled) {
      if (!pagingResult && paramsToken) {
        const post = findModel(json, {
          collection: MAPPING_TYPES.POSTS,
          findObj: { token: paramsToken },
        })
        result = post ? pages[`/posts/${post.id}/comments`] : null
      }
    }
    return result && result.pagination
  }
)

export const selectCategories = createSelector(
  [selectCategoryCollection, selectAllCategories],
  (categoryCollection, allCategories) => {
    const categories = []
    let primary = []
    let secondary = []
    let tertiary = []
    if (allCategories) {
      for (const id of allCategories.ids) {
        const cat = categoryCollection[id]
        if (cat) {
          categories.push(cat)
        }
      }
    }
    for (const category of categories) {
      switch (category.level) {
        case 'primary':
          primary.push(category)
          break
        case 'secondary':
          secondary.push(category)
          break
        case 'tertiary':
          tertiary.push(category)
          break
        default:
          break
      }
    }
    primary = primary.sort(sortCategories)
    secondary = secondary.sort(sortCategories)
    tertiary = tertiary.sort(sortCategories)
    return { primary, secondary, tertiary }
  }
)

export const selectCategoryPageTitle = createSelector(
  [selectParamsType], (paramsType) => {
    switch (paramsType) {
      case 'all':
        return null
      case undefined:
      case 'recommended':
        return 'Featured'
      default:
        return upperFirst(paramsType)
    }
  }
)

