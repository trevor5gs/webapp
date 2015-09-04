import { expect, getRenderedComponent } from '../spec_helper'
import { default as subject, RelationshipPriority } from '../../src/components/buttons/RelationshipButton'
import { MiniPlusIcon, MiniCheckIcon } from '../../src/components/iconography/Icons'

describe('RelationshipPriority', () => {
  it('INACTIVE', () => {
    expect(RelationshipPriority.INACTIVE).to.deep.equal({ priority: 'inactive' })
  })
  it('FRIEND', () => {
    expect(RelationshipPriority.FRIEND).to.deep.equal({ priority: 'friend' })
  })
  it('NOISE', () => {
    expect(RelationshipPriority.NOISE).to.deep.equal({ priority: 'noise' })
  })
  it('SELF', () => {
    expect(RelationshipPriority.SELF).to.deep.equal({ priority: 'self' })
  })
  it('MUTE', () => {
    expect(RelationshipPriority.MUTE).to.deep.equal({ priority: 'mute' })
  })
  it('BLOCK', () => {
    expect(RelationshipPriority.BLOCK).to.deep.equal({ priority: 'block' })
  })
  it('NONE', () => {
    expect(RelationshipPriority.NONE).to.deep.equal({ priority: 'none' })
  })
})

describe('RelationshipButton#render', () => {
  xit('renders inactive by default', () => {
    const button = getRenderedComponent(subject, {className: 'MyRelationshipButton'})
    expect(button.type).to.equal('button')
    expect(button.props.className).to.equal('MyRelationshipButton RelationshipButton')
    expect(button.props.onClick).to.be.a('function')
    expect(button.props['data-priority']).to.equal('inactive')
    const [icon, span] = button.props.children
    expect(icon.type).to.equal(MiniPlusIcon)
    expect(span.props.children).to.equal('Follow')
  })

  xit('renders inactive', () => {
    const button = getRenderedComponent(subject, { priority: 'inactive' })
    const [icon, span] = button.props.children
    expect(icon.type).to.equal(MiniPlusIcon)
    expect(span.props.children).to.equal('Follow')
  })

  xit('renders none', () => {
    const button = getRenderedComponent(subject, { priority: 'none' })
    const [icon, span] = button.props.children
    expect(icon.type).to.equal(MiniPlusIcon)
    expect(span.props.children).to.equal('Follow')
  })

  xit('renders friend', () => {
    const button = getRenderedComponent(subject)
    button.setState(RelationshipPriority.FRIEND)
    const [icon, span] = button.props.children
    expect(icon.type).to.equal(MiniCheckIcon)
    expect(span.props.children).to.equal('Friend')
  })

  xit('renders noise', () => {
    const button = getRenderedComponent(subject, { priority: 'noise' })
    const [icon, span] = button.props.children
    expect(icon.type).to.equal(MiniCheckIcon)
    expect(span.props.children).to.equal('Noise')
  })

  xit('renders mute', () => {
    const button = getRenderedComponent(subject, { priority: 'mute' })
    const [span] = button.props.children
    expect(span.props.children).to.equal('Muted')
  })

  xit('renders block', () => {
    const button = getRenderedComponent(subject, { priority: 'block' })
    const [span] = button.props.children
    expect(span.props.children).to.equal('Blocked')
  })
})

