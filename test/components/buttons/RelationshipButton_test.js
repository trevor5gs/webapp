import { expect, getRenderedComponent } from '../../spec_helper'
import { default as subject, RelationshipPriority } from '../../../src/components/buttons/RelationshipButton'
import { MiniCheckIcon, MiniPlusIcon } from '../../../src/components/users/UserIcons'

describe('RelationshipButton', () => {
  describe('::RelationshipPriority', () => {
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
      const button = getRenderedComponent(subject, RelationshipPriority.INACTIVE)
      const [icon, span] = button.props.children
      expect(icon.type).to.equal(MiniPlusIcon)
      expect(span.props.children).to.equal('Follow')
    })

    it('renders none', () => {
      const button = getRenderedComponent(subject, RelationshipPriority.NONE)
      const [icon, span] = button.props.children
      expect(icon.type).to.equal(MiniPlusIcon)
      expect(span.props.children).to.equal('Follow')
    })

    it('renders friend', () => {
      const button = getRenderedComponent(subject, RelationshipPriority.FRIEND)
      const [icon, span] = button.props.children
      expect(icon.type).to.equal(MiniCheckIcon)
      expect(span.props.children).to.equal('Friend')
    })

    it('renders noise', () => {
      const button = getRenderedComponent(subject, RelationshipPriority.NOISE)
      const [icon, span] = button.props.children
      expect(icon.type).to.equal(MiniCheckIcon)
      expect(span.props.children).to.equal('Noise')
    })

    it('renders mute', () => {
      const button = getRenderedComponent(subject, RelationshipPriority.MUTE)
      const span = button.props.children
      expect(span.props.children).to.equal('Muted')
    })

    it('renders block', () => {
      const button = getRenderedComponent(subject, RelationshipPriority.BLOCK)
      const span = button.props.children
      expect(span.props.children).to.equal('Blocked')
    })
  })
})
