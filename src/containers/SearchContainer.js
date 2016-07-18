import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { replace } from 'react-router-redux'
import { debounce, get, isEqual } from 'lodash'
import { updateQueryParams } from '../helpers/uri_helper'
import { searchForPosts, searchForUsers } from '../actions/search'
import { trackEvent } from '../actions/tracking'
import { hideSoftKeyboard } from '../vendor/jello'
import { Search } from '../components/views/Search'

const TABS = [
  { type: 'posts', children: 'Posts' },
  { type: 'users', children: 'People' },
]

export function getStreamAction(props) {
  const { terms, type } = props
  if (terms && terms.length > 1) {
    return type === 'users' ? searchForUsers(terms) : searchForPosts(terms)
  }
  return null
}

export function shouldSearchContainerUpdate(thisProps, nextProps) {
  const names = ['coverDPI', 'isLoggedIn', 'pathname', 'terms', 'type']
  const thisCompare = {}
  const nextCompare = {}
  names.forEach((name) => {
    thisCompare[name] = thisProps[name]
    nextCompare[name] = nextProps[name]
  })
  return !isEqual(thisCompare, nextCompare)
}

export function mapStateToProps(state, ownProps) {
  const { authentication, gui, promotions } = state
  const { location } = ownProps
  return {
    coverDPI: gui.coverDPI,
    isLoggedIn: authentication.isLoggedIn,
    pathname: get(location, 'pathname', ''),
    promotions: authentication.isLoggedIn ? promotions.loggedIn : promotions.loggedOut,
    terms: get(location, 'query.terms', ''),
    type: get(location, 'query.type', 'posts'),
  }
}

export class SearchContainer extends Component {
  static propTypes = {
    coverDPI: PropTypes.string.isRequired,
    debounceWait: PropTypes.number,
    dispatch: PropTypes.func.isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
    pathname: PropTypes.string.isRequired,
    promotions: PropTypes.array,
    type: PropTypes.string.isRequired,
    terms: PropTypes.string.isRequired,
  }

  static preRender = (store, routerState) => {
    const term = get(routerState, 'location.query.terms', '')
    const type = get(routerState, 'location.query.type', 'posts')
    const action = type === 'users' ? searchForUsers : searchForPosts
    return store.dispatch(action(term))
  }

  componentWillMount() {
    const { debounceWait = 666 } = this.props
    if (debounceWait > 0) {
      this.search = debounce(this.search, debounceWait, { leading: true })
    }
  }

  componentDidMount() {
    const { terms, type } = this.props
    this.search({ terms, type })
  }

  shouldComponentUpdate(nextProps) {
    return shouldSearchContainerUpdate(this.props, nextProps)
  }

  onChangeControl = (vo) => {
    this.search(vo)
  }

  onSubmit = (e) => {
    e.preventDefault()
    hideSoftKeyboard()
  }

  onClickTrackCredits = () => {
    const { dispatch } = this.props
    dispatch(trackEvent('banderole-credits-clicked'))
  }

  search(valueObject) {
    const { dispatch, isLoggedIn, pathname } = this.props
    const vo = valueObject
    if (typeof vo.terms === 'string' && vo.terms.length < 2) {
      vo.terms = null
    }
    if (typeof vo.type === 'string' && vo.type === 'posts') {
      vo.type = null
    }
    const uri = pathname + updateQueryParams(vo)
    dispatch(replace(uri))

    if (vo.terms && vo.terms.length > 1) {
      const label = vo.type && vo.type === 'users' ? 'people' : 'posts'
      const trackStr = `search-logged-${isLoggedIn ? 'in' : 'out'}-${label}`
      dispatch(trackEvent(trackStr))
    }
  }

  render() {
    const { coverDPI, isLoggedIn, promotions, terms, type } = this.props
    const props = {
      coverDPI,
      isLoggedIn,
      onChange: this.onChangeControl,
      onClickTrackCredits: this.onClickTrackCredits,
      onSubmit: this.onSubmit,
      promotions,
      streamAction: getStreamAction(this.props),
      streamKey: `search_${type}_${terms}`,
      tabs: TABS,
      terms,
      type,
    }
    return <Search {...props} />
  }
}

export default connect(mapStateToProps)(SearchContainer)

