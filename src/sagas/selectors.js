import { get } from 'lodash'
import { createSelector } from 'reselect'

export const accessTokenSelector = state => get(state, 'authentication.accessToken')
export const expirationDateSelector = state => get(state, 'authentication.expirationDate')
export const isLoggedInSelector = state => get(state, 'authentication.isLoggedIn')
export const refreshTokenSelector = state => get(state, 'authentication.refreshToken')

export const shouldUseAccessTokenSelector = createSelector(
  accessTokenSelector, expirationDateSelector, isLoggedInSelector,
  (accessToken, expirationDate, isLoggedIn) =>
    isLoggedIn && accessToken && expirationDate > new Date()
)

export const shouldUseRefreshTokenSelector = createSelector(
  accessTokenSelector, expirationDateSelector, isLoggedInSelector,
  (accessToken, expirationDate, isLoggedIn) =>
    isLoggedIn && accessToken && !(expirationDate > new Date())
)

