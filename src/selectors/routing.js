// import { createSelector } from 'reselect'
import { get } from 'lodash'

// props.routing.xxx
export const selectPropsPathname = (state, props) => get(props, 'location.pathname')
export const selectPropsQueryTerms = (state, props) => get(props, 'location.query.terms')
export const selectPropsQueryType = (state, props) => get(props, 'location.query.type')

// state.routing.xxx
export const selectLocation = state => get(state, 'routing.location')
export const selectPreviousPath = state => get(state, 'routing.previousPath')

// state.routing.location.xxx
export const selectPathname = state => get(state, 'routing.location.pathname')

// Memoized selectors

