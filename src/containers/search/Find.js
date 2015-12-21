import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { replaceState } from 'redux-router'
import classNames from 'classnames'
import debounce from 'lodash.debounce'
import * as ACTION_TYPES from '../../constants/action_types'
import { SIGNED_OUT_PROMOTIONS } from '../../constants/promotion_types'
import * as SearchActions from '../../actions/search'
import { trackEvent } from '../../actions/tracking'
import { updateQueryParams } from '../../components/base/uri_helper'
import Banderole from '../../components/assets/Banderole'
import SearchControl from '../../components/forms/SearchControl'
import StreamComponent from '../../components/streams/StreamComponent'

class Find extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    location: PropTypes.shape({
      query: PropTypes.shape({
        terms: PropTypes.string,
        type: PropTypes.string,
      }).isRequired,
    }).isRequired,
    search: PropTypes.object.isRequired,
  }

  constructor(props, context) {
    super(props, context)
    this.state = this.props.search
    const terms = props.location.query.terms
    const type = props.location.query.type
    if (terms) {
      this.state.terms = terms
    }
    if (type && (type === 'users' || type === 'posts')) {
      this.state.type = type
    } else {
      this.state.type = 'posts'
    }
    this.updateLocation({ ...this.state })
  }

  componentWillMount() {
    this.search = debounce(this.search, 300)
    this.updateLocation = debounce(this.updateLocation, 300)
  }

  getAction() {
    const { terms, type } = this.state
    if (terms && terms.length > 1) {
      if (type === 'users') {
        return SearchActions.searchForUsers(terms)
      }
      return SearchActions.searchForPosts(terms)
    }
    return null
  }

  search() {
    const { dispatch } = this.props
    const { type } = this.state
    dispatch({
      type: ACTION_TYPES.SEARCH.SAVE,
      payload: this.state,
    })
    const action = this.getAction()
    if (action) {
      const label = type === 'users' ? 'people' : 'posts'
      this.refs.streamComponent.refs.wrappedInstance.setAction(action)
      dispatch(trackEvent(`search-logged-out-${label}`))
    }
  }

  updateLocation(vo) {
    const { dispatch } = this.props
    if (typeof vo.terms === 'string' && vo.terms.length < 2) {
      vo.terms = null
    }
    if (typeof vo.type === 'string' && vo.type === 'posts') {
      vo.type = null
    }
    const uri = document.location.pathname + updateQueryParams(vo)
    dispatch(replaceState(window.history.state, uri))
  }

  handleControlChange(vo) {
    this.setState(vo)
    this.search()
    this.updateLocation(vo)
  }

  creditsTrackingEvent() {
    const { dispatch } = this.props
    dispatch(trackEvent(`banderole-credits-clicked`))
  }

  render() {
    const { terms, type } = this.state
    return (
      <section className="Search Panel">
        <Banderole
          creditsClickAction={ ::this.creditsTrackingEvent }
          userlist={ SIGNED_OUT_PROMOTIONS }
        />
        <div className="SearchBar">
          <SearchControl text={terms} controlWasChanged={::this.handleControlChange} />
          <button className={classNames('SearchFilter', { active: type === 'posts' })} onClick={() => { this.handleControlChange({ type: 'posts' }) }} >
            Posts
          </button>
          <button className={classNames('SearchFilter', { active: type === 'users' })} onClick={() => { this.handleControlChange({ type: 'users' }) }} >
            People
          </button>
        </div>
        <StreamComponent ref="streamComponent" action={this.getAction()} />
      </section>
    )
  }
}

function mapStateToProps(state) {
  return {
    search: state.search,
  }
}

export default connect(mapStateToProps)(Find)

