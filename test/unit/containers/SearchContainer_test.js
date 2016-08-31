import {
  getStreamAction, shouldContainerUpdate,
} from '../../../src/containers/SearchContainer'

describe('SearchContainer', () => {
  context('#getStreamAction', () => {
    it('returns the correct stream action for user search', () => {
      const action = getStreamAction('@mansfield', 'users')
      expect(action.payload.endpoint.path).to.contain('/users?per_page=25&terms=%40mansfield')
    })

    it('returns the correct stream action for post search', () => {
      const action = getStreamAction('danger', 'posts')
      expect(action.payload.endpoint.path).to.contain('/posts?per_page=25&terms=danger')
    })
  })

  context('#shouldContainerUpdate', () => {
    it('returns the correct stream action for user search', () => {
      const thisProps = {
        coverDPI: 'xhdpi',
        isLoggedIn: true,
        pathname: '/search',
        promitions: {},
        terms: '@mansfield',
        type: 'users',
      }
      const sameProps = { ...thisProps }
      const nextProps = {
        coverDPI: 'xhdpi',
        isLoggedIn: true,
        pathname: '/search',
        promitions: { stuff: 'stuff' },
        terms: 'danger',
        type: 'posts',
      }
      const lastProps = {
        coverDPI: 'xhdpi',
        isLoggedIn: true,
        pathname: '/search',
        promitions: { stuff: 'stuff' },
        terms: 'danger_zo',
        type: 'posts',
      }
      const shouldSameUpdate = shouldContainerUpdate(thisProps, sameProps)
      const shouldNextUpdate = shouldContainerUpdate(thisProps, nextProps)
      const shouldLastUpdate = shouldContainerUpdate(nextProps, lastProps)
      expect(shouldSameUpdate).to.be.false
      expect(shouldNextUpdate).to.be.true
      expect(shouldLastUpdate).to.be.true
    })
  })
})

