import {
  selectPropsPathname,
  selectPropsQueryTerms,
  selectPropsQueryType,
  selectLocation,
  selectPreviousPath,
  selectPathname,
} from '../../../src/selectors/routing'


describe('routing selectors', () => {
  let routing
  let propsLocation

  beforeEach(() => {
    routing = {
      location: {
        pathname: '/state',
        query: { terms: 'state.query.terms', type: 'state.query.type' },
      },
      previousPath: 'state.previousPath',
    }
    propsLocation = {
      location: {
        pathname: '/props',
        query: { terms: 'props.query.terms', type: 'props.query.type' },
      },
    }
  })

  afterEach(() => {
    routing = {}
    propsLocation = {}
  })

  context('#selectPropsPathname', () => {
    it('returns the props.location.pathname', () => {
      const state = { routing }
      const props = { ...propsLocation }
      expect(selectPropsPathname(state, props)).to.equal('/props')
    })
  })

  context('#selectPropsQueryTerms', () => {
    it('returns the props.location.query.terms', () => {
      const state = { routing }
      const props = { ...propsLocation }
      expect(selectPropsQueryTerms(state, props)).to.equal('props.query.terms')
    })
  })

  context('#selectPropsQueryType', () => {
    it('returns the props.location.query.type', () => {
      const state = { routing }
      const props = { ...propsLocation }
      expect(selectPropsQueryType(state, props)).to.equal('props.query.type')
    })
  })

  context('#selectLocation', () => {
    it('returns the state.routing.location', () => {
      const state = { routing }
      const props = { ...propsLocation }
      expect(selectLocation(state, props)).to.deep.equal(routing.location)
    })
  })

  context('#selectPreviousPath', () => {
    it('returns the state.routing.location', () => {
      const state = { routing }
      const props = { ...propsLocation }
      expect(selectPreviousPath(state, props)).to.deep.equal(routing.previousPath)
    })
  })

  context('#selectPathname', () => {
    it('returns the state.routing.location.pathname', () => {
      const state = { routing }
      const props = { ...propsLocation }
      expect(selectPathname(state, props)).to.deep.equal(routing.location.pathname)
    })
  })
})

