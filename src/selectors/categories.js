import { createSelector } from 'reselect'
import get from 'lodash/get'
import trunc from 'trunc-html'
import { META } from '../constants/locales/en'
import { selectAllCategoriesPage } from './pages'
import { selectParamsType } from './params'
import { selectCategoryData, selectPagePromotionals } from './promotions'

export function sortCategories(a, b) {
  if (a.order < b.order) {
    return -1
  } else if (a.order > b.order) {
    return 1
  }
  return 0
}

// state.json.categories.xxx
export const selectCategoryCollection = state => get(state, 'json.categories')

export const selectAllCategoriesAsArray = createSelector(
  [selectCategoryCollection, selectAllCategoriesPage],
  (categories, allCategoryPage) => {
    if (!categories || !allCategoryPage) { return [] }
    return allCategoryPage.ids.map(key => categories[key])
  }
)

// Memoized selectors
export const selectCategories = createSelector(
  [selectAllCategoriesAsArray], (allCats) => {
    const cats = {}
    // add cats to the correct arrays
    allCats.forEach((cat) => {
      const level = cat.level && cat.level.length ? cat.level : 'other'
      if (!cats[level]) {
        cats[level] = []
      }
      cats[level].push(cat)
    })
    // sort arrays
    Object.keys(cats).forEach((level) => {
      cats[level].sort(sortCategories)
    })
    return cats
  }
)

export const selectOnboardingCategories = createSelector(
  [selectCategories], (categories) => {
    let cats = [];
    ['primary', 'secondary', 'tertiary'].forEach((level) => {
      const levelArr = categories[level]
      if (levelArr) { cats = cats.concat(levelArr) }
    })
    return cats
  }
)

export const selectCategoryPageTitle = createSelector(
  [selectParamsType], (paramsType) => {
    switch (paramsType) {
      case undefined:
      case 'recommended':
        return 'Featured'
      case 'recent':
        return 'Recent'
      case 'trending':
        return 'Trending'
      default:
        return null
    }
  }
)

export const selectCategoryTabs = createSelector(
  [selectCategories], (categories) => {
    const { meta, primary, secondary, tertiary } = categories
    const tabs = []
    if (!primary) { return tabs }
    [meta, primary, secondary, tertiary].filter(arr => arr).forEach((level, index) => {
      level.forEach((category) => {
        const tab = {
          to: category.slug === 'featured' ? '/discover' : `/discover/${category.slug}`,
          children: category.name,
        }
        if (category.slug === 'featured') {
          tab.activePattern = /^\/(?:discover(\/featured|\/recommended)?)?$/
        }
        tabs.push(tab)
      })
      if (index === 0) { tabs.push({ kind: 'divider' }) }
    })
    return tabs
  }
)

export const selectDiscoverMetaData = createSelector(
  [selectParamsType, selectPagePromotionals, selectCategoryData, selectCategoryPageTitle],
  (type, pagePromotionals, categoryData, pageTitle) => {
    const titlePrefix = pageTitle ? `${pageTitle} | ` : ''
    const title = `${titlePrefix}Ello`
    let description = ''
    let image = pagePromotionals && pagePromotionals[Object.keys(pagePromotionals)[0]] ?
      pagePromotionals[Object.keys(pagePromotionals)[0]].image.hdpi.url : META.IMAGE
    switch (type) {
      case undefined:
      case 'featured':
      case 'recommended':
        description = META.FEATURED_PAGE_DESCRIPTION
        break
      case 'recent':
        description = META.RECENT_PAGE_DESCRIPTION
        break
      case 'trending':
        description = META.TRENDING_PAGE_DESCRIPTION
        break
      case 'all':
        description = META.ALL_PAGE_DESCRIPTION
        break
      default: {
        const { category, promotionals } = categoryData
        description = category && category.description ?
          trunc(category.description, 160).text : META.DESCRIPTION
        image = promotionals[0] ? promotionals[0].image.hdpi.url : META.IMAGE
        break
      }
    }
    return { description, image, title }
  }
)

