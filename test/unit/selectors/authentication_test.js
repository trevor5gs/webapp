import { stubAuthenticationStore } from '../../support/stubs'
import {
  selectAccessToken,
  selectExpirationDate,
  selectIsLoggedIn,
  selectRefreshToken,
  selectShouldUseAccessToken,
  selectShouldUseRefreshToken,
} from '../../../src/selectors/authentication'


describe('authentication selectors', () => {
  let authentication
  beforeEach(() => {
    authentication = stubAuthenticationStore()
  })

  afterEach(() => {
    authentication = {}
  })

  context('#selectAccessToken', () => {
    it('returns the correct accessToken', () => {
      const state = { authentication }
      expect(selectAccessToken(state)).to.equal('authenticationAccessToken')
    })
  })

  context('#selectExpirationDate', () => {
    it('returns the correct expirationDate', () => {
      const state = { authentication }
      expect(selectExpirationDate(state)).to.equal('authenticationExpirationDate')
    })
  })

  context('#selectIsLoggedIn', () => {
    it('returns the correct isLoggedIn', () => {
      const state = { authentication }
      expect(selectIsLoggedIn(state)).to.equal(true)
    })
  })

  context('#selectRefreshToken', () => {
    it('returns the correct refreshToken', () => {
      const state = { authentication }
      expect(selectRefreshToken(state)).to.equal('authenticationRefreshToken')
    })
  })

  context('#selectShouldUseAccessToken', () => {
    const n = new Date()
    const twentyfour = (24 * 60 * 60 * 1000)
    const future = new Date(n.getTime() + twentyfour)
    const past = new Date(n.getTime() - twentyfour)
    it('returns whether to use the access token or not', () => {
      let state = { authentication: { ...authentication, expirationDate: future, change: false } }
      expect(selectShouldUseAccessToken(state)).to.equal(true)

      state = { authentication: { ...state, change: true } }
      expect(selectShouldUseAccessToken.recomputations()).to.equal(1)

      state = { authentication: { ...authentication, expirationDate: past, change: true } }
      expect(selectShouldUseAccessToken(state)).to.equal(false)
      expect(selectShouldUseAccessToken.recomputations()).to.equal(2)
    })
  })

  context('#selectShouldUseRefreshToken', () => {
    const n = new Date()
    const twentyfour = (24 * 60 * 60 * 1000)
    const future = new Date(n.getTime() + twentyfour)
    const past = new Date(n.getTime() - twentyfour)
    it('returns whether to use the refreshToken or not', () => {
      let state = { authentication: { ...authentication, expirationDate: future, change: false } }
      expect(selectShouldUseRefreshToken(state)).to.equal(false)

      state = { authentication: { ...state, change: true } }
      expect(selectShouldUseRefreshToken.recomputations()).to.equal(1)

      state = { authentication: { ...authentication, expirationDate: past, change: true } }
      expect(selectShouldUseRefreshToken(state)).to.equal(true)
      expect(selectShouldUseRefreshToken.recomputations()).to.equal(2)
    })
  })
})

