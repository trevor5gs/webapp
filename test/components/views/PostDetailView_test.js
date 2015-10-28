import { expect, getRenderedComponent } from '../../spec_helper'
import { default as subject } from '../../../src/components/views/PostDetailView'

describe('PostDetailView', () => {
  it('#render', () => {
    const comp = getRenderedComponent(subject, { params: { token: 'yay' } })
    expect(comp.props.className).to.equal('PostDetail Panel')
    expect(comp.type).to.equal('section')
    const streamComp = comp.props.children
    expect(streamComp.ref).to.equal('streamComponent')
  })
})

