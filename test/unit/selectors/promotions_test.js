import { stubPromotion, stubAuthPromotion } from '../../support/stubs'
import {
  selectPromotionsAuthentication,
  selectPromotionsLoggedIn,
  selectPromotionsLoggedOut,
  selectPromotions,
} from '../../../src/selectors/promotions'

describe('promotions selectors', () => {
  let authentication
  let promotions
  beforeEach(() => {
    authentication = { isLoggedIn: true }
    promotions = {
      authentication: stubAuthPromotion(),
      loggedIn: stubPromotion('loggedIn'),
      loggedOut: stubPromotion('loggedOut'),
    }
  })

  afterEach(() => {
    authentication = {}
    promotions = {}
  })

  context('#selectPromotionsAuthentication', () => {
    it('returns the promotions.authentication', () => {
      const state = { authentication, promotions }
      expect(selectPromotionsAuthentication(state)).to.deep.equal(promotions.authentication)
    })
  })

  context('#selectPromotionsLoggedIn', () => {
    it('returns the promotions.loggedIn', () => {
      const state = { authentication, promotions }
      expect(selectPromotionsLoggedIn(state)).to.deep.equal(promotions.loggedIn)
    })
  })

  context('#selectPromotionsLoggedOut', () => {
    it('returns the promotions.loggedOut', () => {
      const state = { authentication, promotions }
      expect(selectPromotionsLoggedOut(state)).to.deep.equal(promotions.loggedOut)
    })
  })

  context('#selectPromotions', () => {
    it('returns the promotions.loggedIn when logged in', () => {
      const state = { authentication, promotions }
      expect(selectPromotions(state)).to.deep.equal(promotions.loggedIn)
      const nextState = { ...state, change: 1 }
      expect(selectPromotions(nextState)).to.deep.equal(promotions.loggedIn)
      expect(selectPromotions.recomputations()).to.equal(1)
    })

    it('returns the promotions.loggedOut when logged out', () => {
      const state = { authentication: { isLoggedIn: false }, promotions }
      expect(selectPromotions(state)).to.deep.equal(promotions.loggedOut)
      const nextState = { ...state, change: 1 }
      expect(selectPromotions(nextState)).to.deep.equal(promotions.loggedOut)
      // Scoped to 2 since recomputations are part of the context block
      expect(selectPromotions.recomputations()).to.equal(2)
    })
  })
})

