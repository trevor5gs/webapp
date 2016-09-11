/* eslint-disable import/prefer-default-export */
import { get } from 'lodash'

// state.emoji.xxx
export const selectEmojis = (state) => get(state, 'emoji.emojis')

// Memoized selectors

