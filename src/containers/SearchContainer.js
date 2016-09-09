import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { replace } from 'react-router-redux'
import shallowCompare from 'react-addons-shallow-compare'
import { debounce, get, sample } from 'lodash'
import { updateQueryParams } from '../helpers/uri_helper'
import { searchForPosts, searchForUsers } from '../actions/search'
import { trackEvent } from '../actions/analytics'
import { hideSoftKeyboard } from '../vendor/jello'
import SearchControl from '../components/forms/SearchControl'
import StreamContainer from './StreamContainer'
import { MainView } from '../components/views/MainView'
import Promotion from '../components/assets/Promotion'

const TABS = [
  { type: 'posts', children: 'Posts' },
  { type: 'users', children: 'People' },
]

export function getStreamAction(terms, type) {
  if (terms && terms.length > 1) {
    return type === 'users' ? searchForUsers(terms) : searchForPosts(terms)
  }
  return null
}

export function mapStateToProps(state, props) {
  const { authentication, gui, promotions } = state
  const { location } = props
  return {
    coverDPI: gui.coverDPI,
    isLoggedIn: authentication.isLoggedIn,
    pathname: get(location, 'pathname', ''),
    promotions: authentication.isLoggedIn ? promotions.loggedIn : promotions.loggedOut,
    terms: get(location, 'query.terms', ''),
    type: get(location, 'query.type', 'posts'),
  }
}

class SearchContainer extends Component {
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
    const { debounceWait = 666, promotions, type } = this.props
    if (debounceWait > 0) {
      this.search = debounce(this.search, debounceWait)
    }
    this.state = { promotion: sample(promotions), type }
  }

  componentDidMount() {
    const { terms } = this.props
    const { type } = this.state
    this.search({ terms, type })
  }

  componentWillReceiveProps(nextProps) {
    if (!this.state.promotion) {
      this.setState({ promotion: sample(nextProps.promotions) })
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }

  onChangeControl = (vo) => {
    this.search(vo)
    if (vo.type) {
      this.setState(vo)
    }
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
    dispatch(replace({ pathname, search: updateQueryParams(vo) }))

    if (vo.terms && vo.terms.length > 1) {
      const label = vo.type && vo.type === 'users' ? 'people' : 'posts'
      const trackStr = `search-logged-${isLoggedIn ? 'in' : 'out'}-${label}`
      dispatch(trackEvent(trackStr))
    }
  }

  render() {
    const { coverDPI, isLoggedIn, terms } = this.props
    const { promotion, type } = this.state
    let inputText = terms
    if (type === 'users' && terms.length === 0) {
      inputText = '@'
    } else if (type === 'posts' && terms === '@') {
      inputText = ''
    }
    return (
      <MainView className="Search">
        <Promotion
          coverDPI={coverDPI}
          isLoggedIn={isLoggedIn}
          onClickTrackCredits={this.onClickTrackCredits}
          promotion={promotion}
        />
        <SearchControl
          activeType={type}
          onChange={this.onChangeControl}
          onSubmit={this.onSubmit}
          tabs={TABS}
          text={inputText}
        />
        <StreamContainer
          action={getStreamAction(terms, type)}
          key={`search_${type}_${terms}`}
        />
      </MainView>
    )
  }
}

export default connect(mapStateToProps)(SearchContainer)

