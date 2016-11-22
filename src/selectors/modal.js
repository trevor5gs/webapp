// import { createSelector } from 'reselect'
import get from 'lodash/get'

// state.modal.xxx
export const selectIsModalActive = state => get(state, 'modal.isActive')
export const selectModalKind = state => get(state, 'modal.kind')
export const selectModalType = state => get(state, 'modal.type')

// Memoized selectors

