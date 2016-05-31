import { get } from 'lodash'

export const isLoggedInSelector = state => get(state, 'authentication.isLoggedIn')
export const accessTokenSelector = state => get(state, 'authentication.accessToken')
export const refreshTokenSelector = state => get(state, 'authentication.refreshToken')
