// import { createSelector } from 'reselect'
import { get } from 'lodash'

// state.modal.xxx
export const selectIsModalActive = state => get(state, 'modal.isActive')
export const selectModalKind = state => get(state, 'modal.kind')

// Memoized selectors

