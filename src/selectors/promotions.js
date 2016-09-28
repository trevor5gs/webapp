import { createSelector } from 'reselect'
import get from 'lodash/get'
import { selectIsLoggedIn } from './authentication'

// state.promotions.xxx
export const selectPromotionsAuthentication = state => get(state, 'promotions.authentication')
export const selectPromotionsLoggedIn = state => get(state, 'promotions.loggedIn')
export const selectPromotionsLoggedOut = state => get(state, 'promotions.loggedOut')

// Memoized selectors
export const selectPromotions = createSelector(
  [selectIsLoggedIn, selectPromotionsLoggedIn, selectPromotionsLoggedOut],
  (isLoggedIn, loggedInPromotions, loggedOutPromotions) =>
    (isLoggedIn ? loggedInPromotions : loggedOutPromotions)
)

