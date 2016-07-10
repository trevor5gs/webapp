import { expect } from '../../spec_helper'
import {
  getStreamAction, shouldSearchContainerUpdate,
} from '../../../src/containers/SearchContainer'

describe('SearchContainer', () => {
  context('#getStreamAction', () => {
    it('returns the correct stream action for user search', () => {
      const vo = { terms: '@mansfield', type: 'users' }
      const action = getStreamAction(vo)
      expect(action.payload.endpoint.path).to.contain('/users?per_page=25&terms=%40mansfield')
    })

    it('returns the correct stream action for post search', () => {
      const vo = { terms: 'danger', type: 'posts' }
      const action = getStreamAction(vo)
      expect(action.payload.endpoint.path).to.contain('/posts?per_page=25&terms=danger')
    })
  })

  context('#shouldSearchContainerUpdate', () => {
    it('returns the correct stream action for user search', () => {
      const thisProps = {
        coverDPI: 'xhdpi',
        isLoggedIn: true,
        pathname: '/search',
        terms: '@mansfield',
        type: 'users',
      }
      const sameProps = {
        coverDPI: 'xhdpi',
        isLoggedIn: true,
        pathname: '/search',
        terms: '@mansfield',
        type: 'users',
      }
      const nextProps = {
        coverDPI: 'xhdpi',
        isLoggedIn: true,
        pathname: '/search',
        terms: 'danger',
        type: 'posts',
      }
      const lastProps = {
        coverDPI: 'xhdpi',
        isLoggedIn: true,
        pathname: '/search',
        terms: 'danger_zo',
        type: 'posts',
      }
      const shouldSameUpdate = shouldSearchContainerUpdate(thisProps, sameProps)
      const shouldNextUpdate = shouldSearchContainerUpdate(thisProps, nextProps)
      const shouldLastUpdate = shouldSearchContainerUpdate(nextProps, lastProps)
      expect(shouldSameUpdate).to.be.false
      expect(shouldNextUpdate).to.be.true
      expect(shouldLastUpdate).to.be.true
    })
  })
})

