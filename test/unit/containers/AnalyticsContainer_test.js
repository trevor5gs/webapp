import { expect } from '../../spec_helper'
import { shouldContainerUpdate } from '../../../src/containers/AnalyticsContainer'

describe('AnalyticsContainer', () => {
  context('#shouldContainerUpdate', () => {
    const thisProps = {
      allowsAnalytics: true,
      analyticsId: '1234',
      isLoggedIn: true,
      notPicked: 'notPicked',
    }
    const sameProps = { ...thisProps }
    const nextProps = {
      allowsAnalytics: false,
      analyticsId: '',
      isLoggedIn: false,
      notPicked: 'notPicked',
    }
    const lastProps = {
      allowsAnalytics: false,
      analyticsId: '',
      isLoggedIn: false,
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
  })
})

