import { expect, getRenderedComponent, sinon } from '../../spec_helper'
import { StreamComponent as subject } from '../../../src/components/streams/StreamComponent'

function createPropsForStream(props = {}) {
  const defaultProps = { stream: { error: false }, action: () => {}, dispatch: () => {}, json: {}, result: { type: 'posts', ids: [] } }
  return Object.assign(defaultProps, props)
}

describe('StreamComponent', () => {
  describe('#render', () => {
    describe('StreamComponent hasErrored', () => {
      it('renders errors', () => {
        const comp = getRenderedComponent(subject, createPropsForStream({ stream: { error: true } }))
        expect(comp.props.className).to.equal('StreamComponent hasErrored')
        expect(comp.type).to.equal('section')
        const div = comp.props.children
        expect(div.props.className).to.equal('StreamErrorMessage')
        // const [ img, p1, p2, p3 ] = div.props.children
      })
    })

    describe('StreamComponent isBusy', () => {
      it('renders a loader when no result', () => {
        const comp = getRenderedComponent(subject, createPropsForStream({ result: null }))
        expect(comp.type).to.equal('section')
        expect(comp.props.className).to.equal('StreamComponent isBusy')
        const div = comp.props.children
        expect(div.props.className).to.equal('StreamBusyIndicator')
      })

      it('renders a loader when no result.type', () => {
        const comp = getRenderedComponent(subject, createPropsForStream({ result: { type: null } }))
        expect(comp.type).to.equal('section')
        expect(comp.props.className).to.equal('StreamComponent isBusy')
        const div = comp.props.children
        expect(div.props.className).to.equal('StreamBusyIndicator')
      })

      it('renders a loader when no result.ids', () => {
        const comp = getRenderedComponent(subject, createPropsForStream({ result: { ids: null } }))
        expect(comp.type).to.equal('section')
        expect(comp.props.className).to.equal('StreamComponent isBusy')
        const div = comp.props.children
        expect(div.props.className).to.equal('StreamBusyIndicator')
      })

      it('renders a loader when there is no jsonables', () => {
        const comp = getRenderedComponent(subject, createPropsForStream({ meta: true }))
        expect(comp.type).to.equal('section')
        expect(comp.props.className).to.equal('StreamComponent isBusy')
        const div = comp.props.children
        expect(div.props.className).to.equal('StreamBusyIndicator')
      })

      it('renders a loader when there is no meta data', () => {
        const comp = getRenderedComponent(subject, createPropsForStream({ meta: false, json: { posts: { '1': { id: '1' }, '2': { id: '2' } } }, result: { type: 'posts', ids: ['1', '2'] } }))
        expect(comp.type).to.equal('section')
        expect(comp.props.className).to.equal('StreamComponent isBusy')
        const div = comp.props.children
        expect(div.props.className).to.equal('StreamBusyIndicator')
      })
    })

    describe('StreamComponent', () => {
      it('renders the stream', () => {
        const props = createPropsForStream({
          payload: {
            vo: 'what',
          },
          meta: {
            renderStream: () => {},
          },
          json: {
            posts: {
              '1': { id: '1' },
            },
          },
          result: {
            type: 'posts',
            ids: ['1'],
          },
        })
        const renderSpy = sinon.spy(props.meta, 'renderStream')
        const comp = getRenderedComponent(subject, props)
        expect(comp.type).to.equal('section')
        expect(comp.props.className).to.equal('StreamComponent')
        expect(renderSpy.calledWith([{ id: '1' }], { posts: { '1': { id: '1' } } }, 'what')).to.be.true
      })
    })
  })
})

