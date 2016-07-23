import { createSelector } from 'reselect'
import { get } from 'lodash'
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

// Top level state and props
const selectJSON = (state) => state.json

// props.params.xxx
const selectParamsToken = (state, props) => {
  const token = get(props, 'params.token')
  return token ? token.toLowerCase() : undefined
}

// props.location.xxx
const selectLocationPathname = (state, props) => get(props, 'location.pathname')

// state.json.xxx
const selectPages = (state) => get(state, 'json.pages')
const selectPagingResult = (state, props) => state.json.pages[props.location.pathname]


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

