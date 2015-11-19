import { expect, getRenderedComponent } from '../../spec_helper'
import { default as subject, RelationshipPriority } from '../../../src/components/buttons/RelationshipButton'
import { MiniCheckIcon, MiniPlusIcon } from '../../../src/components/users/UserIcons'

describe('RelationshipButton', () => {
  describe('::RelationshipPriority', () => {
    it('INACTIVE', () => {
      expect(RelationshipPriority.INACTIVE).to.equal('inactive')
    })

    it('FRIEND', () => {
      expect(RelationshipPriority.FRIEND).to.equal('friend')
    })

    it('NOISE', () => {
      expect(RelationshipPriority.NOISE).to.equal('noise')
    })

    it('SELF', () => {
      expect(RelationshipPriority.SELF).to.equal('self')
    })

    it('MUTE', () => {
      expect(RelationshipPriority.MUTE).to.equal('mute')
    })

    it('BLOCK', () => {
      expect(RelationshipPriority.BLOCK).to.equal('block')
    })

    it('NONE', () => {
      expect(RelationshipPriority.NONE).to.equal('none')
    })
  })

  describe('#render', () => {
    it('renders inactive by default', () => {
      const button = getRenderedComponent(subject, {className: 'MyRelationshipButton'})
      expect(button.type).to.equal('button')
      expect(button.props.className).to.equal('MyRelationshipButton RelationshipButton')
      expect(button.props.onClick).to.be.a('function')
      expect(button.props['data-priority']).to.equal('inactive')
      const [icon, span] = button.props.children
      expect(icon.type).to.equal(MiniPlusIcon)
      expect(span.props.children).to.equal('Follow')
    })

    it('renders inactive', () => {
      const button = getRenderedComponent(subject, { priority: RelationshipPriority.INACTIVE })
      const [icon, span] = button.props.children
      expect(icon.type).to.equal(MiniPlusIcon)
      expect(span.props.children).to.equal('Follow')
    })

    it('renders none', () => {
      const button = getRenderedComponent(subject, { priority: RelationshipPriority.NONE })
      const [icon, span] = button.props.children
      expect(icon.type).to.equal(MiniPlusIcon)
      expect(span.props.children).to.equal('Follow')
    })

    it('renders friend', () => {
      const button = getRenderedComponent(subject, { priority: RelationshipPriority.FRIEND })
      const [icon, span] = button.props.children
      expect(icon.type).to.equal(MiniCheckIcon)
      expect(span.props.children).to.equal('Friend')
    })

    it('renders noise', () => {
      const button = getRenderedComponent(subject, { priority: RelationshipPriority.NOISE })
      const [icon, span] = button.props.children
      expect(icon.type).to.equal(MiniCheckIcon)
      expect(span.props.children).to.equal('Noise')
    })

    it('renders mute', () => {
      const button = getRenderedComponent(subject, { priority: RelationshipPriority.MUTE })
      const span = button.props.children
      expect(span.props.children).to.equal('Muted')
    })

    it('renders block', () => {
      const button = getRenderedComponent(subject, { priority: RelationshipPriority.BLOCK })
      const span = button.props.children
      expect(span.props.children).to.equal('Blocked')
    })
  })
})
