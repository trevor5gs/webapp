import { expect, getRenderedComponent } from '../../spec_helper'
import { default as subject } from '../../../src/components/users/UserDetail'

describe('UserDetail', () => {
  it('#render', () => {
    const comp = getRenderedComponent(subject, { params: { username: 'sweet' } })
    expect(comp.props.className).to.equal('UserDetail Panel')
    expect(comp.type).to.equal('section')
    const streamComp = comp.props.children
    expect(streamComp.ref).to.equal('streamComponent')
  })
})

