import { expect } from '../../spec_helper'
import { shouldContainerUpdate } from '../../../src/containers/AppContainer'

describe('AppContainer', () => {
  context('#shouldContainerUpdate', () => {
    const thisProps = {
      authentication: 'thisAuth',
      pagination: 'thisPagination',
      params: 'thisParams',
      notPicked: 'notPicked',
    }
    const sameProps = { ...thisProps }
    const nextProps = {
      authentication: 'nextAuth',
      pagination: 'nextPagination',
      params: 'nextParams',
      notPicked: 'notPicked',
    }
    const lastProps = {
      authentication: 'nextAuth',
      pagination: 'nextPagination',
      params: 'nextParams',
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

