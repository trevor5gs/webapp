import { createSelector } from 'reselect'
import get from 'lodash/get'
import startCase from 'lodash/startCase'
import { selectParamsType } from './params'
import { selectAllCategories } from './pages'

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

// Memoized selectors
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

export const selectCategoriesAsArray = createSelector(
  [selectCategories], categories =>
    categories.primary.concat(categories.secondary, categories.tertiary)
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
        const key = categories &&
          Object.keys(categories).find(k => categories[k].slug === paramsType)
        return key ? categories[key].name : startCase(paramsType).replace(/\sX\s/, ' x ')
      }
    }
  }
)

export const selectCategoryTabs = createSelector(
  [selectCategories], (categories) => {
    const { primary, secondary, tertiary } = categories
    const tabs = []
    // add featured/trending/recent by default
    tabs.push({
      to: '/discover',
      children: 'Featured',
      activePattern: /^\/(?:discover(\/featured|\/recommended)?)?$/,
    })
    tabs.push({
      to: '/discover/trending',
      children: 'Trending',
    })
    tabs.push({
      to: '/discover/recent',
      children: 'Recent',
    })
    // add line to split categories
    tabs.push({ kind: 'divider' })
    for (const category of primary) {
      tabs.push({
        to: `/discover/${category.slug}`,
        children: category.name,
      })
    }
    for (const category of secondary) {
      tabs.push({
        to: `/discover/${category.slug}`,
        children: category.name,
      })
    }
    for (const category of tertiary) {
      tabs.push({
        to: `/discover/${category.slug}`,
        children: category.name,
      })
    }
    return tabs
  }
)

