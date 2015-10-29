import { expect, getRenderedComponent } from '../../spec_helper'
import { default as subject } from '../../../src/components/views/UserDetailView'

describe('UserDetailView', () => {
  it('#render', () => {
    const comp = getRenderedComponent(subject, { params: { username: 'sweet' } })
    expect(comp.props.className).to.equal('UserDetailView Panel')
    expect(comp.type).to.equal('section')
    const streamComp = comp.props.children
    expect(streamComp.ref).to.equal('streamComponent')
  })
})

