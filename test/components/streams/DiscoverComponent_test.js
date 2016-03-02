import { expect, getRenderedComponent, sinon } from '../../spec_helper'

import { Discover as Component } from '../../../src/containers/discover/Discover'

function createPropsForComponent(props = {}) {
  const defaultProps = {
    currentStream: '/following',
    dispatch: sinon.spy(),
    isLoggedIn: false,
    params: {},
    pathname: '/',
  }

  return { ...defaultProps, ...props }
}

describe('DiscoverComponent', () => {
  describe('#componentWillMount', () => {
    it("doesn't redirect logged out users", () => {
      const props = createPropsForComponent()
      getRenderedComponent(Component, props)
      expect(props.dispatch.callCount).to.equal(0)
    })

    it("still doesn't redirect when there's a currentStream", () => {
      const props = createPropsForComponent({
        currentStream: '/discover/trending',
      })

      getRenderedComponent(Component, props)

      expect(props.dispatch.callCount).to.equal(0)
    })
  })
})
