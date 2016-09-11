/* eslint-disable import/prefer-default-export */
import { get } from 'lodash'

// state.stream.xxx
export const selectStreamType = (state) => get(state, 'stream.type')

// state.stream.meta.xxx
export const selectStreamMappingType = (state) => get(state, 'stream.meta.mappingType')

// state.stream.payload.xxx
export const selectStreamPostIdOrToken = (state) => get(state, 'stream.payload.postIdOrToken')

// Memoized selectors

