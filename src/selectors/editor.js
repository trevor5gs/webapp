/* eslint-disable import/prefer-default-export */

// import { createSelector } from 'reselect'
import { get } from 'lodash'

// state.editor.xxx
export const selectCompletions = (state) => get(state, 'editor.completions')

// Memoized Selectors

