import { get } from 'lodash'
import { expect } from '../../spec_helper'
import { stubJSONStore } from '../../stubs'
import { shouldContainerUpdate, mapStateToProps } from '../../../src/containers/PostDetailContainer'

describe('PostDetailContainer', () => {
  context('#shouldContainerUpdate', () => {
    const thisProps = {
      author: undefined,
      isLoggedIn: false,
      paramsToken: 'thisParamsToken',
      post: undefined,
      streamError: 'thisStreamError',
      streamType: 'thisStreamType',
      notPicked: 'notPicked',
    }
    const sameProps = { ...thisProps }
    const nextProps = {
      author: 'nextAuthor',
      isLoggedIn: true,
      paramsToken: 'nextParamsToken',
      post: 'nextPost',
      streamError: 'nextStreamError',
      streamType: 'nextStreamType',
      notPicked: 'notPicked',
    }
    const lastProps = {
      author: 'nextAuthor',
      isLoggedIn: true,
      paramsToken: 'nextParamsToken',
      post: 'nextPost',
      streamError: 'nextStreamError',
      streamType: 'nextStreamType',
      notPicked: 'changed',
    }
    const shouldSameUpdate = shouldContainerUpdate(thisProps, sameProps)
    const shouldNextUpdate = shouldContainerUpdate(thisProps, nextProps)
    const shouldLastUpdate = shouldContainerUpdate(nextProps, lastProps)

    it('should not update state since the values are the same', () => {
      expect(shouldSameUpdate).to.be.false
    })

    it('should update state since all value have changed', () => {
      expect(shouldNextUpdate).to.be.true
    })

    it('should not update state since a non-picked value changed', () => {
      expect(shouldLastUpdate).to.be.false
    })

    it('should not update since author and post are undefined', () => {
      expect(shouldContainerUpdate({}, thisProps)).to.be.false
    })

    it('should update since the stream error type changed', () => {
      expect(shouldContainerUpdate(thisProps, { ...nextProps, streamError: 'Error' })).to.be.true
    })
  })

  context('#mapStateToProps', () => {
    const json = stubJSONStore()
    const user1 = get(json, 'users.1')
    const post1 = get(json, 'posts.1')
    const state = {
      authentication: { isLoggedIn: true },
      json,
      stream: { error: {}, type: 'streamType' },
    }
    const props = { params: { token: 'token1' } }
    const mapped = mapStateToProps(state, props)

    it('should select the correct post', () => {
      expect(mapped.post).to.equal(post1)
    })

    it('should map the author (user) from the post', () => {
      expect(mapped.author).to.equal(user1)
    })
  })
})

