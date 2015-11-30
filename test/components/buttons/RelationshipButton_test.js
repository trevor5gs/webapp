import { expect, getRenderedComponent } from '../../spec_helper'
import { RELATIONSHIP_PRIORITY } from '../../../src/constants/relationship_types'
import { default as subject } from '../../../src/components/relationships/RelationshipButton'
import { MiniCheckIcon, MiniPlusIcon } from '../../../src/components/relationships/RelationshipIcons'

describe('RelationshipButton', () => {
  describe('::RELATIONSHIP_PRIORITY', () => {
    it('INACTIVE', () => {
      expect(RELATIONSHIP_PRIORITY.INACTIVE).to.equal('inactive')
    })

    it('FRIEND', () => {
      expect(RELATIONSHIP_PRIORITY.FRIEND).to.equal('friend')
    })

    it('NOISE', () => {
      expect(RELATIONSHIP_PRIORITY.NOISE).to.equal('noise')
    })

    it('SELF', () => {
      expect(RELATIONSHIP_PRIORITY.SELF).to.equal('self')
    })

    it('MUTE', () => {
      expect(RELATIONSHIP_PRIORITY.MUTE).to.equal('mute')
    })

    it('BLOCK', () => {
      expect(RELATIONSHIP_PRIORITY.BLOCK).to.equal('block')
    })

    it('NONE', () => {
      expect(RELATIONSHIP_PRIORITY.NONE).to.equal('none')
    })
  })

  describe('#render', () => {
    it('renders inactive by default', () => {
      const button = getRenderedComponent(subject)
      expect(button.type).to.equal('button')
      expect(button.props.className).to.equal('RelationshipButton')
      expect(button.props.onClick).to.be.a('function')
      expect(button.props['data-priority']).to.equal('inactive')
      const [icon, span] = button.props.children
      expect(icon.type).to.equal(MiniPlusIcon)
      expect(span.props.children).to.equal('Follow')
    })

    it('renders inactive', () => {
      const button = getRenderedComponent(subject, { priority: RELATIONSHIP_PRIORITY.INACTIVE })
      const [icon, span] = button.props.children
      expect(icon.type).to.equal(MiniPlusIcon)
      expect(span.props.children).to.equal('Follow')
    })

    it('renders none', () => {
      const button = getRenderedComponent(subject, { priority: RELATIONSHIP_PRIORITY.NONE })
      const [icon, span] = button.props.children
      expect(icon.type).to.equal(MiniPlusIcon)
      expect(span.props.children).to.equal('Follow')
    })

    it('renders friend', () => {
      const button = getRenderedComponent(subject, { priority: RELATIONSHIP_PRIORITY.FRIEND })
      const [icon, span] = button.props.children
      expect(icon.type).to.equal(MiniCheckIcon)
      expect(span.props.children).to.equal('Following')
    })

    it('renders noise', () => {
      const button = getRenderedComponent(subject, { priority: RELATIONSHIP_PRIORITY.NOISE })
      const [icon, span] = button.props.children
      expect(icon.type).to.equal(MiniCheckIcon)
      expect(span.props.children).to.equal('Starred')
    })

    it('renders mute', () => {
      const button = getRenderedComponent(subject, { priority: RELATIONSHIP_PRIORITY.MUTE })
      const span = button.props.children
      expect(span.props.children).to.equal('Muted')
    })

    it('renders block', () => {
      const button = getRenderedComponent(subject, { priority: RELATIONSHIP_PRIORITY.BLOCK })
      const span = button.props.children
      expect(span.props.children).to.equal('Blocked')
    })
  })
})
