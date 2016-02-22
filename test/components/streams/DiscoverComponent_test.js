import { expect, getRenderedComponent, sinon } from '../../spec_helper'
import { routeActions } from 'react-router-redux'

import { Discover as Component } from '../../../src/containers/discover/Discover'

function createPropsForComponent(props = {}) {
  const defaultProps = {
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

    it('redirects logged in users to /following by default', () => {
      const props = createPropsForComponent({
        isLoggedIn: true,
      })

      getRenderedComponent(Component, props)

      const routeAction = routeActions.replace('/following')
      const routeDispatch = props.dispatch.firstCall
      expect(routeDispatch.args[0]).to.eql(routeAction)
    })

    it('otherwise redirects users to their last active stream', () => {
      const props = createPropsForComponent({
        isLoggedIn: true,
        currentStream: '/discover/trending',
      })

      getRenderedComponent(Component, props)

      const routeAction = routeActions.replace('/discover/trending')
      const routeDispatch = props.dispatch.firstCall
      expect(routeDispatch.args[0]).to.eql(routeAction)
    })
  })
})
