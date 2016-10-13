import { DISCOVER, FOLLOWING, STARRED } from '../../../src/constants/locales/en'
import {
  selectBroadcast,
  selectIsAuthenticationLayout,
  selectIsBackgroundCycleLayout,
  selectIsPromotionLayout,
  selectIsUserProfileLayout,
} from '../../../src/containers/HeroContainer'

describe('HeroContainer', () => {
  context('#selectIsAuthenticationLayout', () => {
    it('selects with memoization whether the current route has a authentication promotion', () => {
      let state = { routing: { location: { pathname: '/enter', change: false } } }
      expect(selectIsAuthenticationLayout(state)).to.equal(true)

      state = { routing: { location: { pathname: '/forgot-password', change: true } } }
      expect(selectIsAuthenticationLayout(state)).to.equal(true)
      expect(selectIsAuthenticationLayout.recomputations()).to.equal(1)

      state = { routing: { location: { pathname: '/signup', change: true } } }
      expect(selectIsAuthenticationLayout(state)).to.equal(true)
      expect(selectIsAuthenticationLayout.recomputations()).to.equal(1)

      const noPromos = [
        '/discover',
        '/discover/stuff',
        '/search',
        '/join',
        '/following',
        '/settings',
        '/invitations',
        '/notifications',
        '/mk/post/etlb9br06dh6tleztw4g',
        '/mk',
        '/mk/loves',
      ]
      noPromos.forEach((route) => {
        state = { routing: { location: { pathname: route, change: false } } }
        expect(selectIsAuthenticationLayout(state)).to.equal(false, `${route} should not have a Promotion.`)
      })
      expect(selectIsAuthenticationLayout.recomputations()).to.equal(10)
    })
  })

  context('#selectIsBackgroundCycleLayout', () => {
    it('selects with memoization whether the current route has a animated background', () => {
      let state = { routing: { location: { pathname: '/join', change: false } } }
      expect(selectIsBackgroundCycleLayout(state)).to.equal(true)

      const noPromos = [
        '/discover',
        '/enter',
        '/search',
        '/signup',
        '/following',
        '/settings',
        '/invitations',
        '/notifications',
        '/mk/post/etlb9br06dh6tleztw4g',
        '/mk',
        '/mk/loves',
      ]
      noPromos.forEach((route) => {
        state = { routing: { location: { pathname: route, change: false } } }
        expect(selectIsBackgroundCycleLayout(state)).to.equal(false)
      })
      expect(selectIsBackgroundCycleLayout.recomputations()).to.equal(11)
    })
  })

  context('#selectIsPromotionLayout', () => {
    it('selects with memoization whether the current route has a promotion', () => {
      let state = { routing: { location: { pathname: '/search', change: false } } }
      expect(selectIsPromotionLayout(state)).to.equal(true)

      state = { routing: { location: { pathname: '/search', change: true } } }
      expect(selectIsPromotionLayout(state)).to.equal(true)
      expect(selectIsPromotionLayout.recomputations()).to.equal(1)

      state = { routing: { location: { pathname: '/discover', change: true } } }
      expect(selectIsPromotionLayout(state)).to.equal(true)
      expect(selectIsPromotionLayout.recomputations()).to.equal(2)

      state = { routing: { location: { pathname: '/discover/stuff', change: true } } }
      expect(selectIsPromotionLayout(state)).to.equal(true)

      state = { routing: { location: { pathname: '/', change: true } } }
      expect(selectIsPromotionLayout(state)).to.equal(true)

      const noPromos = [
        '/following',
        '/settings',
        '/invitations',
        '/notifications',
        '/mk/post/etlb9br06dh6tleztw4g',
        '/mk',
        '/mk/loves',
      ]
      noPromos.forEach((route) => {
        state = { routing: { location: { pathname: route, change: false } } }
        expect(selectIsPromotionLayout(state)).to.equal(false, `${route} should not have a Promotion.`)
      })
      expect(selectIsPromotionLayout.recomputations()).to.equal(8)
    })
  })

  context('#selectIsUserProfileLayout', () => {
    it('selects with memoization whether the current route has a cover', () => {
      let state = { routing: { location: { pathname: '/mk', change: false } } }
      const props = { params: { username: 'mk' } }
      expect(selectIsUserProfileLayout(state, props)).to.equal(true)

      state = { routing: { location: { pathname: '/mk/loves', change: true } } }
      expect(selectIsUserProfileLayout(state, props)).to.equal(true)
      expect(selectIsUserProfileLayout.recomputations()).to.equal(1)

      state = { routing: { location: { pathname: '/mk/following', change: true } } }
      expect(selectIsUserProfileLayout(state, props)).to.equal(true)
      expect(selectIsUserProfileLayout.recomputations()).to.equal(1)

      state = { routing: { location: { pathname: '/mk/followers', change: true } } }
      expect(selectIsUserProfileLayout(state, props)).to.equal(true)

      state = { routing: { location: { pathname: '/mk/posts', change: true } } }
      expect(selectIsUserProfileLayout(state, props)).to.equal(true)

      const noCovers = [
        '/',
        '/following',
        '/starred',
        '/settings',
        '/invitations',
        '/notifications',
        '/mk/post/etlb9br06dh6tleztw4g',
      ]
      noCovers.forEach((route) => {
        state = { routing: { location: { pathname: route, change: false } } }
        expect(selectIsUserProfileLayout(state)).to.equal(false, `${route} should not have a UserProfile.`)
      })
      expect(selectIsUserProfileLayout.recomputations()).to.equal(8)
    })
  })

  context('#selectBroadcast', () => {
    it('selects with memoization whether the current route has a broadcast message', () => {
      let state = {
        authentication: { isLoggedIn: true },
        gui: { lastDiscoverBeaconVersion: null },
        routing: { location: { pathname: '/discover', change: false } },
      }
      expect(selectBroadcast(state)).to.equal(DISCOVER.BEACON_TEXT)

      state = {
        authentication: { isLoggedIn: true },
        gui: { lastDiscoverBeaconVersion: null },
        routing: { location: { pathname: '/discover', change: true } },
      }
      expect(selectBroadcast(state)).to.equal(DISCOVER.BEACON_TEXT)
      expect(selectBroadcast.recomputations()).to.equal(1)

      state = {
        authentication: { isLoggedIn: true },
        gui: { lastDiscoverBeaconVersion: '1' },
        routing: { location: { pathname: '/discover', change: true } },
      }
      expect(selectBroadcast(state)).to.equal(null)

      state = {
        authentication: { isLoggedIn: true },
        gui: { lastFollowingBeaconVersion: null },
        routing: { location: { pathname: '/following', change: true } },
      }
      expect(selectBroadcast(state)).to.equal(FOLLOWING.BEACON_TEXT)

      state = {
        authentication: { isLoggedIn: true },
        gui: { lastFollowingBeaconVersion: '1' },
        routing: { location: { pathname: '/following', change: true } },
      }
      expect(selectBroadcast(state)).to.equal(null)

      state = {
        authentication: { isLoggedIn: true },
        gui: { lastStarredBeaconVersion: null },
        routing: { location: { pathname: '/starred', change: true } },
      }
      expect(selectBroadcast(state)).to.equal(STARRED.BEACON_TEXT)

      state = {
        authentication: { isLoggedIn: true },
        gui: { lastStarredBeaconVersion: '1' },
        routing: { location: { pathname: '/starred', change: true } },
      }
      expect(selectBroadcast(state)).to.equal(null)

      const noBroadcasts = [
        '/settings',
        '/invitations',
        '/notifications',
        '/mk/post/etlb9br06dh6tleztw4g',
        '/mk',
        '/mk/loves',
        '/mk/following',
        '/mk/followers',
      ]
      noBroadcasts.forEach((route) => {
        state = { routing: { location: { pathname: route, change: false } } }
        expect(selectBroadcast(state)).to.equal(null, `${route} should not have a Broadcast.`)
      })
      expect(selectBroadcast.recomputations()).to.equal(11)
    })
  })
})

