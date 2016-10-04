import { selectUserDetailPathClassName } from '../../../src/containers/ViewportContainer'

describe('HeroContainer', () => {
  context('#selectUserDetailPathClassName', () => {
    it('selects with memoization the user detail route as a className', () => {
      let state = { routing: { location: { pathname: '/mk', change: false } } }
      const props = { params: { username: 'mk' } }
      expect(selectUserDetailPathClassName(state, props)).to.equal('isUserDetailPosts')
      expect(selectUserDetailPathClassName(state, props)).to.equal('isUserDetailPosts')

      state = { routing: { location: { pathname: '/mk/loves', change: true } } }
      expect(selectUserDetailPathClassName(state, props)).to.equal('isUserDetailLoves')
      expect(selectUserDetailPathClassName.recomputations()).to.equal(2)

      state = { routing: { location: { pathname: '/mk/following', change: true } } }
      expect(selectUserDetailPathClassName(state, props)).to.equal('isUserDetailFollowing')
      expect(selectUserDetailPathClassName.recomputations()).to.equal(3)

      state = { routing: { location: { pathname: '/mk/followers', change: true } } }
      expect(selectUserDetailPathClassName(state, props)).to.equal('isUserDetailFollowers')

      state = { routing: { location: { pathname: '/mk/posts', change: true } } }
      expect(selectUserDetailPathClassName(state, props)).to.equal('isUserDetailPosts')

      const noPathnames = [
        '/',
        '/following',
        '/starred',
        '/settings',
        '/invitations',
        '/notifications',
        '/mk/post/etlb9br06dh6tleztw4g',
      ]
      noPathnames.forEach((route) => {
        state = { routing: { location: { pathname: route, change: false } } }
        expect(selectUserDetailPathClassName(state)).to.equal(null, `${route} should not have a className.`)
      })
    })
  })
})

