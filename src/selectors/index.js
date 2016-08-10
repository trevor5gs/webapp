import { createSelector } from 'reselect'
import { startCase, get } from 'lodash'
import * as MAPPING_TYPES from '../constants/mapping_types'
import { findModel } from '../helpers/json_helper'
import { emptyPagination } from '../components/streams/Paginator'

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
export const selectParamsToken = (state, props) => {
  const token = get(props, 'params.token')
  return token ? token.toLowerCase() : undefined
}
export const selectParamsType = (state, props) => get(props, 'params.type')
export const selectParamsUsername = (state, props) => get(props, 'params.username')

// props.location.xxx
const selectLocationPathname = (state, props) => get(props, 'location.pathname')

// state.gui.xxx
const selectSaidHelloTo = (state) => get(state, 'gui.saidHelloTo')
export const selectActiveUserFollowingType = (state) => get(state, 'gui.activeUserFollowingType')

// state.json.xxx
const selectCategoryCollection = (state) => get(state, 'json.categories')
export const selectPages = (state) => get(state, 'json.pages')
export const selectUsers = (state) => get(state, 'json.users')

const selectAllCategories = (state) => get(state, 'json.pages.all-categories')
const selectStreamResult = (state, props) => {
  const meta = get(props, 'action.meta', {})
  const resultPath = meta.resultKey || get(state, 'routing.location.pathname')
  return get(state, ['json', 'pages', resultPath], { ids: [], pagination: emptyPagination() })
}

// Memoized Selectors
export const selectPost = createSelector(
  [selectJSON, selectParamsToken], (json, token) =>
    findModel(json, { collection: MAPPING_TYPES.POSTS, findObj: { token } })
)

export const selectUser = createSelector(
  [selectJSON, selectParamsUsername], (json, username) =>
    findModel(json, { collection: MAPPING_TYPES.USERS, findObj: { username } })
)

export const selectPagination = createSelector(
  [selectJSON, selectPages, selectLocationPathname, selectStreamResult, selectParamsToken],
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
  [selectParamsType, selectCategoryCollection], (paramsType, categories) => {
    switch (paramsType) {
      case 'all':
        return null
      case undefined:
      case 'recommended':
        return 'Featured'
      default: {
        const key = Object.keys(categories).find((k) => categories[k].slug === paramsType)
        return key ? categories[key].name : startCase(paramsType).replace(/\sX\s/, ' x ')
      }
    }
  }
)

const selectStreamResultPath = (state, props) => {
  const meta = get(props, 'action.meta', {})
  return meta.resultKey || get(state, 'routing.location.pathname')
}

const selectStreamDeletions = (state, props) => {
  const meta = get(props, 'action.meta', {})
  const resultPath = meta.resultKey || get(state, 'routing.location.pathname')
  const result = get(state.json, ['pages', resultPath], { ids: [] })
  return (result && result.type === meta.mappingType) ||
    (meta.resultFilter && result.type !== meta.mappingType)
}

const selectRoutingPathname = (state) =>
  get(state, 'routing.location.pathname')

const selectPagingPath = (state, props) =>
  get(props, 'action.payload.endpoint.pagingPath')

export const makeSelectStreamProps = () =>
  createSelector(
    [
      selectStreamResult,
      selectStreamResultPath,
      selectStreamDeletions,
      selectJSON,
      selectRoutingPathname,
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
export const selectHasSaidHelloTo = createSelector(
  [selectSaidHelloTo, selectParamsUsername], (saidHelloTo, username) =>
    saidHelloTo.indexOf(username) !== -1
)

