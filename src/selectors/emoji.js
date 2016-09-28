/* eslint-disable import/prefer-default-export */
import get from 'lodash/get'

// state.emoji.xxx
export const selectEmojis = state => get(state, 'emoji.emojis')

// Memoized selectors

